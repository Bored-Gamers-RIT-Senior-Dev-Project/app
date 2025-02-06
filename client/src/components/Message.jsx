import { Alert, AlertTitle, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { events } from "../utils/events";

const defaultMessageSettings = {
  title: "",
  message: "",
  severity: "info",
  color: null,
  icon: null,
  autoHideDuration: null,
};

const Message = () => {
  const [open, setOpen] = useState(false);
  const [
    { message, severity, color, icon, autoHideDuration, title },
    setMessage,
  ] = useState(defaultMessageSettings);
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    events.subscribe("message", (data) => {
      setMessage({ ...defaultMessageSettings, ...data });
      setOpen(true);
    });
  }, []);

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      autoHideDuration={autoHideDuration}
      key={message}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        color={color}
        variant="filled"
        icon={icon}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Snackbar>
  );
};

export { Message };
