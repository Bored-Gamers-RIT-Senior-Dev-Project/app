import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { users } from "../../utils/api";
import { observeAuthState } from "../../utils/firebase/auth";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(undefined);

    // useEffect with empty array only runs on component initialization.
    // Uses firebase onAuthStateChanged via firebase/auth.js to subscribe to auth state changes.
    // Tracks user token state.
    useEffect(() => {
        //Returns unsubscribe function as per Copilot recommendation.
        return observeAuthState(async (firebaseUser) => {
            if (firebaseUser) {
                users.getProfile().then(setUser);
            } else {
                setUser(null);
            }
        });
    }, []);

    const forceRefresh = async () => {
        users.getProfile().then(setUser);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, forceRefresh }}>
            {children}
        </AuthContext.Provider>
    );
};
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AuthProvider };
