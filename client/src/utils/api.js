import axios from "axios";
import { events } from "./events";
import { getIdToken } from "./firebase/auth";

const API_URL = "http://localhost:3000/api";

/**
 * Constructs the full API URL for a given path.
 * @param {string} path The API path for the given endpoint.
 * @returns The full API URL for the given path.
 */
const buildUrl = (path) => `${API_URL}/${path}`;

/**
 * Add the authorization header to an HTTP request's config object
 * @param {*} config The incoming HTTP configuration
 * @returns The HTTP configuration with the authorization header added.
 */
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
 * Searches for universities and teams based on the required parameters
 * @param {*} params The body of the request
 * @param {string} params.value The search query to search for.
 * @returns {Promise<*>} The search results for the specified search query.
 */
const search = async (params) => {
    const { data } = await api.post("search", params);
    return data;
};

const admin = Object.freeze({
    getRoles: async () => {
        const { data } = await api.get("roles");
        return data;
    },
    getReports: async () => {
        const { data } = await api.get("reports");
        return data;
    },
    getUniversityAdminTickets: async () => {
        const { data } = await api.get("representative");
        return data;
    },
});

const teams = Object.freeze({
    /**
     * Gets a list of existing teams.
     * @returns {Promise<Array<object>>}
     */
    getList: async (getUnapproved = false) => {
        let uri = "teams";
        if (getUnapproved) uri += "?showUnapproved=true";
        const { data } = await api.get(uri);
        return data;
    },
    /**
     * Gets information on a certain team (team page)
     * @param {number} params.id TeamID to
     * @returns The team information
     */
    getInfo: async ({ id }) => {
        const { data } = await api.get(`teams/${id}`);
        return data;
    },
    /**
     * Create a new team, captained by the currently signed in user
     * @param {number} params.universityId The university hosting the team.
     * @param {string} params.teamName The name of the team being created.
     * @returns Confirmation that the team has been created.
     */
    create: async ({ universityId, teamName }) => {
        const { data } = await api.post(`teams`, { teamName, universityId });
        events.publish("refreshAuth"); //Refresh the user profile to load the user's team data.
        return data;
    },
    /**
     * When successful, causes the current user to join the specified team.
     * @param {number} teamId Team ID to join.
     * @returns Confirmation of action result
     */
    join: async ({ teamId }) => {
        const { data } = await api.put(`teams/${teamId}/join`);
        events.publish("refreshAuth"); //Refresh the user profile to load the user's team data.
        return data;
    },
    /**
     * Post an update to the user db
     * @param {object} data The form data for the update.
     * @param {string|null} data.teamName The updated team name.
     * @param {string|null} data.description The updated team description
     * @param {string|null} data.profileImageUrl A URL to a newly uploaded profile image.
     * @param {object} params The params of the route.
     * @param {number} params.teamId The ID of the team being updated (gotten from route)
     * @returns {Promise<boolean>} True on a successful update post.
     */
    update: async ({ teamName, description, profileImageUrl }, { teamId }) => {
        const { data } = await api.post(`teams/${teamId}/update`, {
            teamName,
            description,
            profileImageUrl,
        });
        return data;
    },
});

const users = Object.freeze({
    /**
     * Gets a list of all users that exist in the local database.
     * @returns {Promise<Array<object>>} Users
     */
    getList: async () => {
        const { data } = await api.get("users");
        return data;
    },
    /**
     * Gets the user profile for the currently logged in user.
     * @returns The user profile for the currently logged in user.
     */
    getProfile: async () => {
        const { data } = await api.get("users/profile");
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
        const { data } = await api.post("users/register/google", params);
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
        const { data } = await api.post("users/register", params);
        return data;
    },
    /**
     *
     * Updates the user profile for the specified user
     * @param {*} params The keys to update in the user profile.  //TODO: This function should be further locked down or specified to what the front-end can do once we have the dashboard
     * @returns {Promise<*>} A confirmation of the update
     */
    update: async (userId, params) => {
        const { data } = await api.put(`users/${userId}`, params);
        return data;
    },

    createUser: async (params) => {
        const { data } = await api.post("users", params);
        return data;
    },

    getUser: async (userId) => {
        const { data } = await api.get(`users/${userId}`);
        return data;
    },

    delete: async (userId) => {
        console.log("Deleting " + userId);
        const { data } = await api.delete(`users/${userId}`);
        return data;
    },
});

const university = Object.freeze({
    /**
     * Gets the university information for the specified university
     * @param {*} universityId
     * @returns {Promise<*>} The university information for the specified university
     */
    getInfo: async (universityId) => {
        const { data } = await api.get(`university/${universityId}`);
        return data;
    },

    getList: async () => {
        const { data } = await api.get(`university`);
        return data;
    },
    /**
     * Create a new university in the database
     * @param {object} params The request body
     * @param {string} params.universityName The name of the university to create.
     * @returns Post data
     */
    addUniversity: async (params) => {
        const { data } = await api.post("university", params);
        return data;
    },
});

const combine = (...calls) => {
    return () => Promise.all(calls);
};

export { admin, combine, search, teams, university, users };
