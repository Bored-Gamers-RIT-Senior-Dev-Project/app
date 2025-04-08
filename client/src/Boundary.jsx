import { Backdrop, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { observeAuthState } from "./utils/firebase/auth.js";
import { routes } from "./utils/router.jsx";

// Boundary setup, based on advice from GPT, delays rendering the RouterProvider until Firebase auth state is known, preventing BrowserRouter creation until user session is accessed.
// This is to prevent a flash of the login page before the user is authenticated.
// This is a common pattern in React applications that use Firebase authentication.
const Boundary = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = observeAuthState(() => setLoading(false));
        return () => unsubscribe && unsubscribe(); // Clean up
    }, []); 

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
