import axios from "axios";
import { events } from "./events";
const API_URL = "http://localhost:3000/api";

const url = (path) => `${API_URL}/${path}`;

const sendTest = async (params) => {
  let { data } = await axios.post(url("test"), params);
  console.log("Axios: ", data);
  events.publish("message", { message: "Axios: " + JSON.stringify(data) });
  return data;
};
const getTest = async () => axios.get(url("users"));
export { getTest, sendTest };
