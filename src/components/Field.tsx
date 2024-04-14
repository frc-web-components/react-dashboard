import { Field, FieldPath, FieldRobot } from "@frc-web-components/react";
import {
  booleanProp,
  createComponent,
  numberProp,
  stringDropdownProp,
} from "./fromProps";
import {
  baseUnit,
  fieldConfigs,
  toBaseUnitConversions,
} from "@frc-web-components/fwc";
import {
  useParentSourceJson,
  useParentSourceTree,
} from "../context-providers/ComponentContext";
import { SourceTree } from "../store/selectors/sourceSelectors";
import getPoses from "./get-poses";

export interface FieldObject {
  type: "robot" | "trajectory";
  poses: (Uint8Array | number[])[];
  sourceKey?: string;
  sourceProvider?: string;
}

const getChildren = (tree?: SourceTree): FieldObject[] => {
  if (!tree || tree.childrenSources[".type"]?.value !== "Field2d") {
    return [];
  }

  const children: FieldObject[] = [];
  Object.entries(tree.childrenSources).forEach(([property, childSource]) => {
    // Keys that start with '.' are metadata
    // TODO: Handle XModules property from YAGSL
    if (property.startsWith(".") || property === "XModules") {
      return;
    }

    const source =
      childSource.children.length > 0
        ? childSource.childrenSources.pose
        : childSource;

    if (!source?.value || source.propertyType !== "Number[]") {
      return;
    }
    const poses = getPoses(source.value as number[]);

    children.push({
      type: poses.length === 1 ? "robot" : "trajectory",
      poses,
      sourceKey: source.key,
      sourceProvider: source.provider,
    });
  });

  return children;
};

export const field = createComponent(
  {
    dashboard: {
      name: "Field",
      description: "",
      defaultSize: { width: 300, height: 150 },
      minSize: { width: 60, height: 60 },
    },
    properties: {
      game: stringDropdownProp({
        defaultValue: "Crescendo",
        options: fieldConfigs.map((field) => field.game),
      }),
      rotationUnit: stringDropdownProp({
        defaultValue: "deg",
        options: ["deg", "rad"],
      }),
      unit: stringDropdownProp({
        defaultValue: baseUnit,
        options: Object.keys(toBaseUnitConversions),
      }),
      rotation: numberProp({ min: -360, max: 360 }),
      showGrid: booleanProp(),
      gridSize: numberProp({ min: 0, defaultValue: 1 }),
      origin: stringDropdownProp({
        defaultValue: "blue",
        options: ["blue", "red"],
      }),
      cropLeft: numberProp({ min: 0, max: 100 }),
      cropRight: numberProp({ defaultValue: 100, min: 0, max: 100 }),
      cropTop: numberProp({ min: 0, max: 100 }),
      cropBottom: numberProp({ defaultValue: 100, min: 0, max: 100 }),
    },
  },
  ({
    setProperty,
    className,
    cropLeft,
    cropRight,
    cropTop,
    cropBottom,
    ...props
  }) => {
    const tree = useParentSourceTree();
    const children = getChildren(tree);
    return (
      <Field
        className={className}
        cropLeft={cropLeft / 100}
        cropRight={cropRight / 100}
        cropTop={cropTop / 100}
        cropBottom={cropBottom / 100}
        {...(props as any)}
      >
        {children.map((child) => {
          if (child.type === "robot") {
            return (
              <FieldRobot
                key={child.sourceKey}
                pose={child.poses[0] as number[]}
              />
            );
          }
          return <FieldPath key={child.sourceKey} poses={child.poses} />;
        })}
      </Field>
    );
  }
);
