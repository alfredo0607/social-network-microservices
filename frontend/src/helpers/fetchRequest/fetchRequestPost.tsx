/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://api-panel.bartik-Ing.com:5004/api/v1",
  baseURL: "http://localhost:3003/api/v1",
});

export const setRequestTokenPost = (token: string) =>
  (axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + token);

export const removeRequestTokenPost = () =>
  (axiosInstance.defaults.headers.common["Authorization"] = null);

export const fetchRequestPost = (
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
