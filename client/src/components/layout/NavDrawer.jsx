import { Box, Drawer, Toolbar, Typography, useMediaQuery } from "@mui/material";
import PropTypes from "prop-types";

const NavDrawer = ({ open, onClose }) => {
  const desktop = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  //   const desktop = true;
  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant={desktop ? "permanent" : "temporary"}
    >
      <Toolbar />
      <Box>Drawer!!</Box>
      {desktop && <Typography variant="p">Desktop</Typography>}
    </Drawer>
  );
};

NavDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export { NavDrawer };

