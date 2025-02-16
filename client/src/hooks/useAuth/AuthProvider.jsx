import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getUserData } from "../../utils/api";
import { observeAuthState } from "../../utils/firebase/auth";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        observeAuthState(async (firebaseUser) => {
            if (firebaseUser) {
                const token = await firebaseUser.getIdToken();
                setToken(token);
            } else {
                setToken(null);
            }
        });
    }, []);

    useEffect(() => {
        if (token) {
            getUserData(token).then((data) => {
                console.log(data);
                setUserData(data);
            });
        } else {
            setUserData(null);
        }
    }, [token]);

    useEffect(() => {
        console.log(userData);
    }, [userData]);

    return (
        <AuthContext.Provider value={userData}>{children}</AuthContext.Provider>
    );
};
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AuthProvider };
