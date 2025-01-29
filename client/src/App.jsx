import { Menu } from "@mui/icons-material";
import { AppBar, Box, CssBaseline, IconButton, Toolbar } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router";
import "./App.css";
import title from "./assets/title.png";
import { AccountIcon } from "./components/layout/AccountIcon";
import { NavDrawer } from "./components/layout/NavDrawer";

function App() {
  //MobileDrawer state handles if the drawer is open/closed in mobile view
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
              alignItems: "center",
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
            <Box sx={{ maxWidth: "50%", maxHeight: "90%" }}>
              <img src={title} alt="A New World" height="100%" width="100%" />
            </Box>
            {/* <Typography variant="h6">Tournament App</Typography> */}
            <AccountIcon />
          </Toolbar>
        </AppBar>
        <NavDrawer open={mobileDrawer} onClose={() => setMobileDrawer(false)} />
        <Box sx={{ marginTop: "64px" }}>
          {/* Ensures content is not hidden by the AppBar */}
          <Outlet />
        </Box>
      </Box>
    </>
  );
}

export default App;
