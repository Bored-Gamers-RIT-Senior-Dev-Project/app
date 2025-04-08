import { Backdrop, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { observeAuthState } from "./utils/firebase/auth.js";
import { routes } from "./utils/router.jsx";

// Boundary setup to delay rendering the RouterProvider until Firebase auth state is known
const Boundary = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = observeAuthState(() => setLoading(false));
        return () => unsubscribe && unsubscribe(); // Clean up
    }, []); // 🔑 Empty dependency array so it runs only once

    if (loading) {
        return (
            <Backdrop open={loading} sx={{ zIndex: 10000 }}>
                <CircularProgress color="primary" />
            </Backdrop>
        );
    }

    const router = createBrowserRouter(routes);
    return <RouterProvider router={router} />;
};

export { Boundary };
