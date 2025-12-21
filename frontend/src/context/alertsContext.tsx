/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";
import CustomAlert from "../components/ui/alerts/CustomAlert";

type Severity = "success" | "info" | "warning" | "error" | null;

interface AlertState {
  message: string;
  severity: Severity;
}

interface AlertContextType {
  alert: AlertState;
  showAlert: (message: string, severity: Severity) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider = ({ children }: AlertProviderProps) => {
  const [alert, setAlert] = useState<AlertState>({
    message: "",
    severity: null,
  });

  const showAlert = (message: string, severity: Severity) =>
    setAlert({ message, severity });

  const hideAlert = () => setAlert({ message: "", severity: null });

  return (
    <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}
      <CustomAlert
        type={alert.severity}
        handleClose={hideAlert}
        message={alert.message}
      />
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error("useAlert debe usarse dentro de un AlertProvider");
  }

  return context;
};
