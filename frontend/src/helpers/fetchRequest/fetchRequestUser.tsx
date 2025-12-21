/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3004/api/v1",
});

export const setRequestTokenUser = (token: string) =>
  (axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + token);

export const removeRequestTokenUser = () =>
  (axiosInstance.defaults.headers.common["Authorization"] = null);

export const fetchRequestUser = (
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
