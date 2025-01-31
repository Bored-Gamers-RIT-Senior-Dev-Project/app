import { Backdrop, CircularProgress } from "@mui/material";
import { useState } from "react";
import { events } from "../utils/events";

const Spinner = () => {
  const [open, setOpen] = useState(false);
  events.subscribe("spinner.open", () => setOpen(true));
  events.subscribe("spinner.close", () => setOpen(false));
  return (
    <Backdrop open={open} sx={{ zIndex: 10000 }}>
      <CircularProgress color="primary" />
    </Backdrop>
  );
};

export { Spinner };
