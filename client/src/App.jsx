import { Menu } from "@mui/icons-material";
import { AppBar, Box, CssBaseline, IconButton, Toolbar } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router";
import title from "./assets/game/title_blue.png";
import { AccountIcon } from "./components/layout/AccountIcon";
import { NavDrawer } from "./components/layout/NavDrawer";

function App() {
  //MobileDrawer state handles if the drawer is open/closed in mobile view
  const [mobileDrawer, setMobileDrawer] = useState(false);

  return (
    <>
      <CssBaseline />
      <Box
        id="app"
        sx={{
          display: "flex",
          width: "100%",
          minHeight: "100vh",
        }}
      >
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
        <Box
          id="content"
          sx={{
            width: "100%",
            margin: "1em",
            marginLeft: { lg: "21em" },
          }}
        >
          {/* Empty Toolbar ensures content is not hidden by the AppBar */}
          <Toolbar />
          <Outlet />
        </Box>
      </Box>
    </>
  );
}

export default App;
