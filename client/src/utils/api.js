import axios from "axios";
import { events } from "./events";
const API_URL = "http://localhost:3000/api";

/**
 * Constructs the full API URL for a given path.
 * @param {string} path The API path for the given endpoint.
 * @returns The full API URL for the given path.
 */
const url = (path) => `${API_URL}/${path}`;

//=========================== TEST ===========================
/**
 * Server test function.
 * @param {*} params
 * @returns {Promise<*>} The same as params.
 */
const sendTest = async (params) => {
    let { data } = await axios.post(url("test"), params);
    events.publish("message", { message: "Axios: " + JSON.stringify(data) });
    return data;
};
/**
 * Server test function.
 * @returns {Promise<*>} A list of users.
 */
const getTest = async () => axios.get(url("users"));

//========================== SEARCH ==========================
/**
 *
 * @param {*} params
 * @returns
 */
const search = async (params) => {
    let { data } = await axios.post(url("search"), params);
    return data;
};

// ====================== AUTHENTICATION ======================
//TODO: jsdocs for authentication.  Keeping it undone here solely because I already have another branch with a refactor of the authentication endpoints in progress.
const handleSignIn = async (params) => {
    let { data } = await axios.post(url("users/signin"), params);
    return data;
};

const handleSignUp = async (params) => {
    let { data } = await axios.post(url("users/signup"), params);
    return data;
};

const getUserData = async (token) => {
    let { data } = await axios.post(url("users/get"), { token });
    return data;
};

const updateUser = async (params) => {
    let { data } = await axios.post(url("users/update"), params);
    return data;
};

// ======================== UNIVERSITY ========================
/**
 * Gets a university's information by its ID.
 * @param {*} universityId The university id.
 * @returns {Promise<*>} The university's information.  Null if no university with the given ID exists.
 */
const getUniversityInfo = async (universityId) => {
    let { data } = await axios.get(url(`university/${universityId}`));
    return data;
};

export {
    getTest,
    getUniversityInfo,
    getUserData,
    handleSignIn,
    handleSignUp,
    search,
    sendTest,
    updateUser,
};
