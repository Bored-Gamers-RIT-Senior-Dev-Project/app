import { ThemeProvider } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Boundary } from "./Boundary.jsx";
import { AuthProvider } from "./hooks/useAuth/AuthProvider.jsx";
import "./index.css";
import { theme } from "./utils/theme.js";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <Boundary />
            </ThemeProvider>
        </AuthProvider>
    </StrictMode>
);
