import { Menu } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  IconButton,
  Toolbar,
} from "@mui/material";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import "./App.css";
import title from "./assets/title.png";
import { AccountIcon } from "./components/layout/AccountIcon";
import { NavDrawer } from "./components/layout/NavDrawer";

function App() {
  const [mobileDrawer, setMobileDrawer] = useState(false);
  const navigate = useNavigate(); // For navigation

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
            <Box>
              <Button
                variant="outlined"
                color="inherit"
                sx={{ marginRight: "10px" }}
                onClick={() => navigate("/signin")}
              >
                Sign In
              </Button>
              <AccountIcon />
            </Box>
          </Toolbar>
        </AppBar>
        <NavDrawer open={mobileDrawer} onClose={() => setMobileDrawer(false)} />
        <Box sx={{ marginTop: "64px" }}>
          {" "}
          {/* Ensures content is not hidden by the AppBar */}
          <Outlet />
        </Box>
      </Box>
    </>
  );
}

export default App;
