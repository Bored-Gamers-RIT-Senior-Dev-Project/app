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
import title from "./assets/game/title_white.png";
import { ImageHolder } from "./components/ImageHolder";
import { AccountIcon } from "./components/layout/AccountIcon";
import { NavDrawer } from "./components/layout/NavDrawer";

function App() {
  const desktop = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  //MobileDrawer state handles if the drawer is open/closed.  Default to open when on desktop.
  const [mobileDrawer, setMobileDrawer] = useState(desktop);

  return (
    <Box
      id="app"
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        justifyContent: "center",
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        color="primary"
        elevation={10}
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 10 }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <IconButton
            color="inherit"
            onClick={() => setMobileDrawer(!mobileDrawer)}
            size="large"
            edge="start"
            sx={{ position: "absolute", left: { lg: 25, xs: 15 } }}
          >
            <Menu />
          </IconButton>
          <ImageHolder src={title} alt="A New World" sx={{ maxWidth: "45%" }} />
          <AccountIcon desktop={desktop} />
        </Toolbar>
      </AppBar>
      <NavDrawer
        open={mobileDrawer}
        onClose={() => setMobileDrawer(false)}
        desktop={desktop}
      />
      <Box component="main" sx={{ padding: 2 }}>
        {/* Empty Toolbar ensures content is not hidden by the AppBar */}
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default App;
