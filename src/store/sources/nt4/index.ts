import { Nt4Client } from "@frc-web-components/fwc/source-providers";
import { AppStore } from "../../app/store";
import { setSource, removeSource, PropertyType } from "../../slices/sourceSlice";
import {
  NT4_Client,
  NT4_Topic,
} from "@frc-web-components/fwc/source-providers/nt4/NT4";
import StructDecoder from "./StructDecoder";

const propTypeMap: Record<string, PropertyType> = {
  'boolean': 'Boolean',
  'int': 'Number',
  'float': 'Number',
  'double': 'Number',
  'string': 'String',
  'int[]': 'Number[]',
  'float[]': 'Number[]',
  'double[]': 'Number[]',
  'string[]': 'String[]',
  'structschema': 'Object',
};

function getPropType(type: string, value?: unknown): PropertyType {

  if (type in propTypeMap) {
    return propTypeMap[type];
  }
  if (type === 'json') {
    return value instanceof Array ? 'Object[]' : 'Object'
  }

  if (type.startsWith(NT4Provider.STRUCT_PREFIX)) {
    return value instanceof Array ? 'Object[]' : 'Object';
  }

  return 'Object';
}


abstract class Provider {
  #store: AppStore;

  constructor(store: AppStore) {
    this.#store = store;
  }

  abstract componentUpdate(key: string, value: unknown, type: string): unknown;

  update(key: string, value: unknown, type: string, propertyType: PropertyType) {
    // dispatch action from store
    this.#store.dispatch(setSource({ key, value, provider: "NT", type, propertyType }));
  }
}

export class NT4Provider extends Provider {
  #nt4: NT4_Client;
  #structDecoder = new StructDecoder();
  static STRUCT_PREFIX = "struct:";
  #topics: Record<string, NT4_Topic> = {};

  constructor(store: AppStore) {
    super(store);
    // this.#store = store;

    this.#nt4 = new Nt4Client(
      "localhost",
      "FRC Web Components",
      (topic: NT4_Topic) => {
        this.#topics[topic.name] = topic;
        this.update(topic.name, undefined, topic.type, getPropType(topic.type));
      },
      (topic: NT4_Topic) => {
        delete this.#topics[topic.name];
      },
      (topic: NT4_Topic, timestamp_us: number, value: unknown) => {
        const basicTypes = [
          "boolean",
          "int",
          "float",
          "double",
          "string",
          "int[]",
          "float[]",
          "double[]",
          "string[]",
        ];
        if (topic.type === "structschema") {
          this.#addStructSchema(topic, value as Uint8Array);
        } else if (basicTypes.includes(topic.type)) {
          const propType = getPropType(topic.type);
          this.update(topic.name, value, topic.type, propType);
        } else if (topic.type === "json") {
          if (typeof value === "string") {
            try {
              const json = JSON.parse(value);
              const propType = getPropType(topic.type, json);
              this.update(topic.name, json, topic.type, propType);
            } catch (e) {
              console.warn(`Could not parse json for "${topic.name}"`);
            }
          } else {
            console.warn(
              'Expected a string value for "' + topic.name + '" but got:',
              value
            );
          }
        } else {
          this.#handleRawData(topic, value);
        }
      },
      () => {
        // thisonConnect();
      },
      () => {
        // this.onDisconnect();
      }
    );

    this.#nt4.connect();
    this.#nt4.subscribeAll(["/"], true);
  }

  #handleRawData(topic: NT4_Topic, value: unknown) {
    if (value instanceof Uint8Array) {
      if (topic.type.startsWith(NT4Provider.STRUCT_PREFIX)) {
        let schemaType = topic.type.split(NT4Provider.STRUCT_PREFIX)[1];

        const isArray = schemaType.endsWith("[]");

        if (isArray) {
          schemaType = schemaType.slice(0, -2);
        }
        try {
          const decodedData = isArray
            ? this.#structDecoder.decodeArray(schemaType, value)
            : this.#structDecoder.decode(schemaType, value);
          this.update(topic.name, decodedData.data, topic.type, isArray ? 'Object[]' : 'Object');
        } catch {}
      }
      // else if (topic.type.startsWith(PROTO_PREFIX)) {
      //   let schemaType = topic.type.split(PROTO_PREFIX)[1];
      //   this.log?.putProto(key, timestamp, value, schemaType);
      // } else {
      //   this.log?.putRaw(key, timestamp, value);
      //   if (CustomSchemas.has(topic.type)) {
      //     try {
      //       CustomSchemas.get(topic.type)!(this.log, key, timestamp, value);
      //     } catch {
      //       console.error('Failed to decode custom schema "' + topic.type + '"');
      //     }
      //     this.log.setGeneratedParent(key);
      //   }
      // }
      // updated = true;
    } else {
      console.warn(
        'Expected a raw value for "' + topic.name + '" but got:',
        value
      );
    }
  }

  #addStructSchema(topic: NT4_Topic, value: Uint8Array) {
    // Check for struct schema
    const { name } = topic;
    if (name.includes("/.schema/" + NT4Provider.STRUCT_PREFIX)) {
      this.#structDecoder.addSchema(
        name.split(NT4Provider.STRUCT_PREFIX)[1],
        value
      );
      const { schemas } = this.#structDecoder.toSerialized();
      Object.entries(schemas).forEach(([name, schema]) => {
        this.update(`/.schema/${NT4Provider.STRUCT_PREFIX}${name}`, schema, 'structschema', 'Object');
      });
    }
  }

  componentUpdate(key: string, value: unknown, type: string) {
    const topic = this.#topics[key];
    const propType = getPropType(type);
    if (topic) {
      this.#nt4.publishNewTopic(topic.name, topic.type);
      this.#nt4.addSample(topic.name, value);
      this.update(topic.name, value, type, propType);
    } else if (type !== undefined) {
      this.#nt4.publishNewTopic(key, type);
      this.#nt4.addSample(key, value);
      this.update(key, value, type, propType);
    }
  }
}
