import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { AgGridReact } from 'ag-grid-react';
import { useMemo, useState } from 'react';
import { getData } from './data';
import { useJson } from '@frc-web-components/react';

const Sources = () => {
  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);
  const [rowData, setRowData] = useState<any[]>(getData());
  const json = useJson('', {}, false);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    { field: 'name' },
    // Using dot notation to access nested property
    { field: 'value', editable: true },
    // Show default header name
  ]);

  console.log('json:', json);

  const nt4Data = useMemo(() => {
    const data: { name: string, value: unknown }[] = [];
    if (json) {
      Object.entries(json).forEach(([name, value]) => {
        data.push({ name, value });
      });
    }
    return data;
  }, [json]);

  return (
    <div style={containerStyle}>
      <div style={{ height: '100%', boxSizing: 'border-box' }}>
        <div
          style={gridStyle}
          className={
            "ag-theme-balham-dark"
          }
        >
          <AgGridReact rowData={nt4Data} columnDefs={columnDefs} />
        </div>
      </div>
    </div>
  );
};

export default Sources;