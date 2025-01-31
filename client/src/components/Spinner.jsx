import { Backdrop, CircularProgress } from "@mui/material";
const Spinner = () => {
  return (
    <Backdrop open={true} sx={{ zIndex: 10000 }}>
      <CircularProgress color="primary" />
    </Backdrop>
  );
};

export { Spinner };
