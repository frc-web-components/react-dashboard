

export interface ComponentProperty {
  type: 'Number' | 'String' | 'Boolean' | 'Object' | 'Number[]' | 'String[]' | 'Boolean[]' | 'Object[]',
  defaultValue: unknown;
}

export interface DashboardComponent {
    dashboard: {
      name: string;
      description: string;
      defaultSize: {
        width: number;
        height: number;
      },
      minSize: {
        width: number;
        height: number;
      }
    },
    properties: Record<string, ComponentProperty>;
    component: React.ComponentType<any>;
  }
  