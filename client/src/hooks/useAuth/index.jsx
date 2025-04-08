import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { AuthContext } from "./AuthContext";

/**
 *
 * @param {boolean} restrict When true, redirect users to the login page if they aren't signed in.
 * @returns
 */
const useAuth = (restrict = false) => {
    const location = useLocation();
    const navigate = useNavigate();
    const context = useContext(AuthContext);

    useEffect(() => {
        if (restrict && context.user == null) {
            navigate("/signin", { state: { redirect: location.pathname } });
        }
    });

    return context;
};

export { useAuth };
