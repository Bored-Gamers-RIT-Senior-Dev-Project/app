import { Menu } from "@mui/icons-material";
import {
  AppBar,
  Box,
  CssBaseline,
  IconButton,
  Toolbar,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router";
import bg from "./assets/art/photo_mountains_from_air.jpg";
import title from "./assets/game/title_blue.png";
import { AccountIcon } from "./components/layout/AccountIcon";
import { NavDrawer } from "./components/layout/NavDrawer";

function App() {
  const desktop = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  //MobileDrawer state handles if the drawer is open/closed.  Default to open when on desktop.
  const [mobileDrawer, setMobileDrawer] = useState(desktop);

  return (
    <>
      <CssBaseline />
      <Box
        id="app"
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundAttachment: "scroll",
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
        <NavDrawer
          open={mobileDrawer}
          onClose={() => setMobileDrawer(false)}
          desktop={desktop}
        />
        <Box>
          {/* Empty Toolbar ensures content is not hidden by the AppBar */}
          <Toolbar />
          <Box
            padding="1em"
            sx={{ backgroundColor: "white", borderRadius: "10px" }}
            component="main"
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default App;
