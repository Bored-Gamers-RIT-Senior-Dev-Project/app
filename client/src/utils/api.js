import axios from "axios";
import { events } from "./events";
const API_URL = "http://localhost:3000/api";

const url = (path) => `${API_URL}/${path}`;

const sendTest = async (params) => {
    let { data } = await axios.post(url("test"), params);
    events.publish("message", { message: "Axios: " + JSON.stringify(data) });
    return data;
};
const getTest = async () => axios.get(url("users"));

/****************
 * SEARCH
 ****************/
const search = async (params) => {
    let { data } = await axios.post(url("search"), params);
    return data;
};

/******************
 * AUTHENTICATION *
 ******************/
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

/****************
 * UNIVERSITY
 ****************/
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
