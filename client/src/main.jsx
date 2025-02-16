import { ThemeProvider } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { AuthProvider } from "./hooks/Auth/AuthProvider.jsx";
import "./index.css";
import { router } from "./utils/router.jsx";
import { theme } from "./utils/theme.js";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <RouterProvider router={router} />
            </ThemeProvider>
        </AuthProvider>
    </StrictMode>
);
