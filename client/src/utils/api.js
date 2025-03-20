import axios from "axios";
import { getIdToken } from "./firebase/auth";

const API_URL = "http://localhost:3000/api";

/**
 * Constructs the full API URL for a given path.
 * @param {string} path The API path for the given endpoint.
 * @returns The full API URL for the given path.
 */
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
/**
 * Decorates an axios HTTP function to add the authorization header and build the URL.
 * @param {*} f The Express HTTP function that is being decorated.  This variant does not expect a body, and should be used for functions like GET and DELETE that don't have one.
 * @returns A decorated version of the function provided that adds the authorization header and builds the URL.
 * @example api.get = decorateRequest(api.get);
 */
const decorateRequest =
    (f) =>
    async (path, config = {}) => {
        path = buildUrl(path);
        config = await addAuthorization(config);
        return await f(path, config);
    };

/**
 * Decorates an axios HTTP function to add the authorization header and build the URL.
 * @param {*} f The Express HTTP function that is being decorated.  This variant expects a body, and should be used for functions like POST and PUT.
 * @returns A decorated version of the function provided that adds the authorization header and builds the URL.
 * @example api.post = decorateRequest(api.post);
 */
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

/**
 *
 * @param {*} params
 * @returns
 */
const search = async (params) => {
    let { data } = await api.post("search", params);
    return data;
};

const users = {
    /**
     * Gets the user profile for the currently logged in user.
     * @returns The user profile for the currently logged in user.
     */
    getProfile: async () => {
        let { data } = await api.get("users/profile");
        return data;
    },
    /**
     * Processes a google sign-in to construct a Google user if none exists.
     * @param {object} params to build the google user: {email, username, firstName, lastName}
     * @param {string} params.email The email of the user.
     * @param {string} params.photoURL The default photo url from the user's firebase profile.
     * @param {string} params.displayName The user's display name.
     * @returns The user profile, either newly created or existing, of the currently logged in user.
     */
    google: async (params) => {
        let { data } = await api.post("users/google", params);
        return data;
    },
    /**
     * Creates a new user in the local API database
     * @param {object} params
     * @param {string} params.email The email of the user.
     * @param {string} params.username The username of the user.
     * @param {string} params.firstName The first name of the user.
     * @param {string} params.lastName The last name of the user.
     * @returns {object} The newly created user and a welcome message.
     */
    signUp: async (params) => {
        let { data } = await api.post("users", params);
        return data;
    },
    /**
     *
     * Updates the user profile for the specified user
     * @param {*} params The keys to update in the user profile.  //TODO: This function should be further locked down or specified to what the front-end can do once we have the dashboard
     * @returns {Promise<*>} A confirmation of the update
     */
    update: async (params) => {
        let { data } = await api.put("users", params);
        return data;
    },
};

const university = {
    /**
     * Gets the university information for the specified university
     * @param {*} universityId
     * @returns {Promise<*>} The university information for the specified university
     */
    getInfo: async (universityId) => {
        let { data } = await api.get(`university/${universityId}`);
        return data;
    },
};

export { search, university, users };
