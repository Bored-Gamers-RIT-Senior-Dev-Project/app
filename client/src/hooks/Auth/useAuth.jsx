import { useContext } from "react";
import { AuthContext } from "./AuthContext";

const useAuth = () => {
    const user = useContext(AuthContext);
    return user ? user : {};
};

export { useAuth };
