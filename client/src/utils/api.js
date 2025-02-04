import axios from "axios";
const API_URL = "http://localhost:3000/api";

const url = (path) => `${API_URL}/${path}`;

const sendTest = async (data) => axios.post(url("test"), data);
const getTest = async () => axios.get(url("users"));
export { getTest, sendTest };
