import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { users } from "../../utils/api";
import { events } from "../../utils/events";
import { observeAuthState } from "../../utils/firebase/auth";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(undefined);

    // useEffect with empty array only runs on component initialization.
    // Uses firebase onAuthStateChanged via firebase/auth.js to subscribe to auth state changes.
    // Tracks user token state.
    useEffect(() => {
        //Add event listener to refresh user profile when "refreshAuth" event is triggered.
        // This is useful to check if the user's profile has changed in the background.
        events.subscribe("refreshAuth", () => {
            users.getProfile().then(setUser);
        });

        //Subscribe to firebase auth state changes to get up-to-date profile when user's login state changes.
        //Returns unsubscribe function as per Copilot recommendation.
        return observeAuthState(async (firebaseUser) => {
            if (firebaseUser) {
                users.getProfile().then(setUser);
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
