import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getUserData } from "../../utils/api";
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
                getUserData().then(setUser);
            } else {
                setUser(null);
            }
        });
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AuthProvider };
