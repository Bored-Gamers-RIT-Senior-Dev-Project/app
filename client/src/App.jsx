import { AccountCircle, Menu } from "@mui/icons-material";
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router";
import "./App.css";
import { NavDrawer } from "./components/layout/NavDrawer";
function App() {
  //UseState tracks whether or not the drawer is open (used on mobile devices)
  const [mobileDrawer, setMobileDrawer] = useState(false);
  return (
    <>
      <CssBaseline />
      <Box>
        <AppBar
          position="fixed"
          color="primary"
          elevation={10}
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 10 }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setMobileDrawer(!mobileDrawer)}
              sx={{ display: { lg: "none" } }}
            >
              <Menu />
            </IconButton>
            <Typography variant="h6">Tournament App</Typography>
            <IconButton edge="end" color="inherit">
              <AccountCircle />
            </IconButton>
          </Toolbar>
        </AppBar>
        <NavDrawer open={mobileDrawer} onClose={() => setMobileDrawer(false)} />
        <Outlet />
      </Box>
    </>
  );
}

export default App;
