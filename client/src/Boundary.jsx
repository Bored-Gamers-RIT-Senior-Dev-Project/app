import { Backdrop, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { observeAuthState } from "./utils/firebase/auth.js";
import { routes } from "./utils/router.jsx";

//Boundary setup based on advice from chatgpt, prevents BrowserRouter from being created and rendered until Firebase has had time to access the current user session.
const Boundary = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => observeAuthState(() => setLoading(false)));

    if (loading) {
        return (
            <Backdrop open={open} sx={{ zIndex: 10000 }}>
                <CircularProgress color="primary" />
            </Backdrop>
        );
    }

    const router = createBrowserRouter(routes);
    return <RouterProvider router={router} />;
};

export { Boundary };
