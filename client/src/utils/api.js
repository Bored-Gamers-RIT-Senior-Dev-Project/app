import axios from "axios";
import { events } from "./events";
import { getIdToken } from "./firebase/auth";

const API_URL = "http://localhost:3000/api";

const buildUrl = (path) => `${API_URL}/${path}`;
const addAuthorization = async (config) => {
    const idToken = await getIdToken();
    const headers = config?.headers ?? {};
    if (idToken) {
        config.headers = {
            ...headers,
            Authorization: `Bearer ${idToken}`,
        };
    }
    return config;
};

const api = axios.create();
const decorateRequest =
    (f) =>
    async (path, config = {}) => {
        path = buildUrl(path);
        config = await addAuthorization(config);
        return await f(path, config);
    };
const decorateRequestWithBody =
    (f) =>
    async (path, body, config = {}) => {
        path = buildUrl(path);
        config = await addAuthorization(config);
        return await f(path, body, config);
    };
api.post = decorateRequestWithBody(api.post);
api.put = decorateRequestWithBody(api.put);
api.get = decorateRequest(api.get);
api.delete = decorateRequest(api.delete);

//=========================== TEST ===========================
/**
 * Server test function.
 * @param {*} params
 * @returns {Promise<*>} The same as params.
 */
const sendTest = async (params) => {
    let { data } = await api.post("test", params);
    events.publish("message", { message: "Axios: " + JSON.stringify(data) });
    return data;
};
/**
 * Server test function.
 * @returns {Promise<*>} A list of users.
 */
const getTest = async () => axios.get("users");

//========================== SEARCH ==========================
/**
 *
 * @param {*} params
 * @returns
 */
const search = async (params) => {
    let { data } = await api.post("search", params);
    return data;
};

/******************
 * AUTHENTICATION *
 ******************/
const users = {
    getProfile: async () => {
        let { data } = await api.get("users/profile");
        return data;
    },
    google: async (params) => {
        let { data } = await api.post("users/google", params);
        return data;
    },
    signUp: async (params) => {
        let { data } = await api.post("users", params);
        return data;
    },
    update: async (params) => {
        let { data } = await api.put("users", params);
        return data;
    },
};

// ======================== UNIVERSITY ========================
/**
 * Gets a university's information by its ID.
 * @param {*} universityId The university id.
 * @returns {Promise<*>} The university's information.  Null if no university with the given ID exists.
 */
const getUniversityInfo = async (universityId) => {
    let { data } = await axios.get(`university/${universityId}`);
    return data;
};

export { getTest, getUniversityInfo, search, sendTest, users };
