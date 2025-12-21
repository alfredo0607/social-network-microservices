import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import { X } from "lucide-react";

type Severity = "success" | "info" | "warning" | "error" | null;

interface CustomAlertProps {
  type: Severity;
  handleClose: () => void;
  message: string;
}

const CustomAlert = ({ type, handleClose, message }: CustomAlertProps) => {
  return (
    <Snackbar open={!!type} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        severity={type ?? "info"}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <X />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomAlert;
