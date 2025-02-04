import { Backdrop, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { events } from "../utils/events";

const Spinner = () => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    events.subscribe("spinner.open", () => setOpen(true));
    events.subscribe("spinner.close", () => setOpen(false));
  }, []);

  return (
    <Backdrop open={open} sx={{ zIndex: 10000 }}>
      <CircularProgress color="primary" />
    </Backdrop>
  );
};

export { Spinner };
