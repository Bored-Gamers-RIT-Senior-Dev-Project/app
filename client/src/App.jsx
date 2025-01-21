import { AccountCircle } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Outlet } from "react-router";
import "./App.css";
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
              <Typography variant="h6">Menu</Typography>
            </IconButton>
            <Typography variant="h6">Tournament App</Typography>
            <Box>
              <Button
                variant="outlined"
                color="inherit"
                sx={{ marginRight: "10px" }}
                onClick={() => navigate("/signin")}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </Button>
              <IconButton edge="end" color="inherit" sx={{ marginLeft: "10px" }}>
                <AccountCircle />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
        <NavDrawer open={mobileDrawer} onClose={() => setMobileDrawer(false)} />
        <Box sx={{ marginTop: "64px" }}> {/* Ensures content is not hidden by the AppBar */}
          <Outlet />
        </Box>
      </Box>
    </>
  );
}

export default App;
