import { axios } from "axios";
const API_URL = ".";

const sendTest = async (params) => {
  console.log(params);
  axios({
    method: "post",
    url: `${API_URL}/test`,
    data: params,
  });
};
export { sendTest };
