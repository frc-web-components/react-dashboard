import { PropertyType } from "@store/slices/sourceSlice";
import SourceProvider from "../source-provider";
import {
  WPILibWebSocketClient,
  DriverStationPayload,
  AddressableLEDPayload,
} from "@frc-web-components/node-wpilib-ws";

const dsTypes: Record<
  keyof DriverStationPayload,
  { defaultValue: unknown; type: PropertyType }
> = {
  ">autonomous": { defaultValue: false, type: "Boolean" },
  ">ds": { defaultValue: false, type: "Boolean" },
  ">enabled": { defaultValue: false, type: "Boolean" },
  ">estop": { defaultValue: false, type: "Boolean" },
  ">fms": { defaultValue: false, type: "Boolean" },
  ">game_data": { defaultValue: "", type: "String" },
  ">match_time": { defaultValue: -1, type: "Number" },
  ">new_data": { defaultValue: false, type: "Boolean" },
  ">station": { defaultValue: "red1", type: "String" },
  ">test": { defaultValue: false, type: "Boolean" },
};

const ledTypes: Record<
  keyof AddressableLEDPayload,
  { defaultValue: unknown; type: PropertyType }
> = {
  ">data": { defaultValue: [], type: "Object[]" },
  "<init": { defaultValue: false, type: "Boolean" },
  "<length": { defaultValue: 0, type: "Number" },
  "<output_port": { defaultValue: 0, type: "Number" },
  "<running": { defaultValue: false, type: "Boolean" },
};

export class SimProvider extends SourceProvider {
  #client = new WPILibWebSocketClient();

  constructor() {
    super("Sim", 1000 / 20);

    this.#client.start();

    this.updateDisplayType("/DriverStation", "DriverStation");

    Object.entries(dsTypes).forEach(([prop, { type, defaultValue }]) => {
      this.update(`/DriverStation/${prop}`, defaultValue, type, type);
      this.updateDisplayType(`/DriverStation/${prop}`, type);
    });

    this.#client.addListener("driverStationEvent", (payload) => {
      Object.entries(payload).forEach(([payloadProp, value]) => {
        const { type } = dsTypes[payloadProp as keyof DriverStationPayload];
        this.update(`/DriverStation/${payloadProp}`, value, type, type);
      });
    });

    this.updateDisplayType("/AddressableLED", "AddressableLED");

    Object.entries(ledTypes).forEach(([prop, { type, defaultValue }]) => {
      this.update(`/AddressableLED/${prop}`, defaultValue, type, type);
      this.updateDisplayType(`/AddressableLED/${prop}`, type);
    });

    this.#client.addListener("addressableLEDEvent", (payload) => {
      Object.entries(payload).forEach(([payloadProp, value]) => {
        const { type } = ledTypes[payloadProp as keyof AddressableLEDPayload];
        this.update(`/AddressableLED/${payloadProp}`, value, type, type);
      });
    });
  }

  componentUpdate(key: string, value: unknown, type: string) {
    if (key.startsWith("/DriverStation")) {
      const property = key.split("/DriverStation/")[1];
      this.#client.driverStationUpdateToWpilib({
        [property]: value,
        ">new_data": true,
      });
    }
  }
}
