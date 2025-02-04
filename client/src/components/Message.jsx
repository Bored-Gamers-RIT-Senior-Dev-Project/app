import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { events } from "../utils/events";

const defaultMessageSettings = {
  message: "",
  severity: "info",
  icon: () => <></>,
  autoHideDuration: null,
};

const Message = () => {
  const [open, setOpen] = useState(false);
  const [{ message, severity, icon, autoHideDuration }, setMessage] = useState(
    defaultMessageSettings
  );
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
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        icon={icon}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export { Message };
