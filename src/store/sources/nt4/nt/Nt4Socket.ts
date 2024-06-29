import EventEmitter from "events";
import StrictEventEmitter from "strict-event-emitter-types";
import { getRobotAddresses } from "./utils";

type ConnectionStatus =
  | "CONNECTING"
  | "DISCONNECTING"
  | "CONNECTED"
  | "DISCONNECTED";

interface Nt4SocketEvents {
  socketInstanceConnected: (address: string) => void;
  socketInstanceDisconnected: (address: string, event: CloseEvent) => void;
  socketInstanceMessage: (address: string, event: MessageEvent) => void;
  socketInstanceError: (address: string) => void;

  message: (event: MessageEvent) => void;
  disconnected: (event: CloseEvent) => void;
  connected: () => void;
  error: () => void;
}

export type Nt4SocketEventEmitter = StrictEventEmitter<
  EventEmitter,
  Nt4SocketEvents
>;

export class Nt4Socket extends (EventEmitter as unknown as new () => Nt4SocketEventEmitter) {
  #sockets: { [address: string]: WebSocket } = {};
  #connectedSocketAddress?: string;
  #address = "localhost";
  #connectionStatus: ConnectionStatus = "DISCONNECTED";
  #reconnect = false;
  #appName: string;
  #clientIdx = 0;

  constructor(appName: string) {
    super();
    this.#appName = appName;

    this.on("socketInstanceMessage", (address, ev) => {
      if (address !== this.#connectedSocketAddress) {
        return;
      }
      this.emit("message", ev);
    });

    this.on("socketInstanceConnected", (address) => {
      if (this.#connectionStatus !== "CONNECTING") {
        return;
      }
      this.#connectionStatus = "CONNECTED";
      this.#connectedSocketAddress = address;
      Object.entries(this.#sockets).forEach(([socketAddress, socket]) => {
        if (socketAddress === address) {
          return;
        }
        socket.close();
      });
      this.emit("connected");
    });

    this.on("socketInstanceDisconnected", (address, ev) => {
      if (this.#connectedSocketAddress === address) {
        this.#connectedSocketAddress = undefined;
        this.#cleanupSockets();
        this.#connectionStatus = 'DISCONNECTED';
        this.emit("disconnected", ev);
        if (this.#reconnect) {
          this.connect();
        }
      }
    });

    this.on("socketInstanceError", (address) => {
      if (this.#connectedSocketAddress === address) {
        this.emit("error");
      }
    });
  }

  isConnected() {
    return this.#connectionStatus === 'CONNECTED';
  }

  getClientIdx() {
    return this.#clientIdx;
  }

  send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
    if (!this.isConnected()) {
      return;
    }
    const socket = this.#sockets[this.#connectedSocketAddress!];
    socket.send(data);
  }

  setAddress(address: string) {
    this.#address = address;
  }

  connect(address?: string) {
    this.#reconnect = true;
    const addressChange =
      typeof address === "string" && address !== this.#address;
    if (address) {
      this.#address = address;
    }

    if (
      addressChange ||
      (this.#connectionStatus !== "CONNECTED" &&
        this.#connectionStatus !== "CONNECTING")
    ) {
      this.#updateSockets();
      this.#connectionStatus === "CONNECTING";
    }
  }

  disconnect() {
    this.#reconnect = false;
    Object.values(this.#sockets).forEach((socket) => {
      socket.close();
    });
    this.#connectionStatus === 'DISCONNECTING';
  }

  #cleanupSockets() {
    // disconnect and clean up current sockets
    Object.values(this.#sockets).forEach((socket) => {
      socket.onclose = null;
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.close();
    });
    this.#sockets = {};
  }

  #updateSockets() {
    this.#clientIdx = Math.floor(Math.random() * 99999999);
    this.#cleanupSockets();
    const addresses = getRobotAddresses(this.#address);

    addresses.forEach((address) => {
      this.#createSocket(address);
    });
  }

  #createSocket(baseAddress: string) {
    const address = `ws://${baseAddress}:5810/nt/${this.#appName}_${this.#clientIdx.toString()}`;
    const socket = new WebSocket(address, "networktables.first.wpi.edu");
    socket.binaryType = 'arraybuffer';
    socket.onopen = () => this.emit("socketInstanceConnected", address);
    socket.onclose = (ev) =>
      this.emit("socketInstanceDisconnected", address, ev);
    socket.onerror = () => this.emit("socketInstanceError", address);
    socket.onmessage = ev => this.emit("socketInstanceMessage", address, ev);
    this.#sockets[address] = socket;
  }
}
