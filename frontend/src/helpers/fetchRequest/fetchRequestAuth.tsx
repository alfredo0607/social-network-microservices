/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://api-panel.bartik-Ing.com:5004/api/v1",
  baseURL: "http://localhost:3001/api/v1",
});

export const setRequestToken = (token: string) =>
  (axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + token);

export const removeRequestToken = () =>
  (axiosInstance.defaults.headers.common["Authorization"] = null);

export const fetchRequest = (
  endpoint = "",
  method = "GET",
  data = {},
  responseType: any | undefined = undefined
) => {
  let config = {};

  if (method === "GET") {
    config = { url: endpoint, method, responseType };
  } else {
    config = {
      url: endpoint,
      method,
      data,
    };
  }

  return axiosInstance(config);
};
