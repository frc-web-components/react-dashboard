import GridLayout from "react-grid-layout";
import './components.scss';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useMemo, useState } from "react";
import { Gyro, BasicFmsInfo, Field } from '@frc-web-components/react';


function Components() {

  const [editing, setEditing] = useState(true);

  // layout is an array of objects, see the demo for more complete usage
  const [layout, setLayout] = useState([
    { i: "a", x: 0, y: 0, w: 1, h: 2 },
    { i: "b", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: "c", x: 4, y: 0, w: 1, h: 2, bleh: 3 }
  ]);

  const gridLayout = useMemo(() => {
    return layout.map(item => ({
      ...item,
      static: !editing
    }))
  }, [layout, editing]);

  return (
    <GridLayout
      className="layout editable"
      layout={gridLayout}
      cols={12}
      rowHeight={30}
      width={1200}
      compactType={null}
      preventCollision
      resizeHandles={['ne', 'nw', 'se', 'sw', 's', 'e', 'w', 'n']}
    >
      <div key="a" className="component">
        <Gyro className="component-child" />
      </div>
      <div key="b" className="component">
        <BasicFmsInfo className="component-child" />
      </div>
      <div key="c" className="component">
        <Field className="component-child" />
      </div>
    </GridLayout>
  );

}

export default Components;