import React, { createContext, useContext, ReactNode } from "react";
import Dashboard from "../dashboard";

interface DashboardContextType {
  dashboard: Dashboard;
}

// Create the context with a default value
const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

// Create a provider component
interface ProviderProps {
  children: ReactNode;
  dashboard: Dashboard;
}

export const DashboardProvider: React.FC<ProviderProps> = ({
  children,
  dashboard,
}) => {
  return (
    <DashboardContext.Provider value={{ dashboard }}>
      {children}
    </DashboardContext.Provider>
  );
};

// Hook for consuming the context in components
export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDropZone must be used within a DropZoneProvider");
  }
  return context;
};
