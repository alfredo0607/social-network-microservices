/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3002/api/v1",
});

export const setRequestTokenLike = (token: string) =>
  (axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + token);

export const removeRequestTokenLike = () =>
  (axiosInstance.defaults.headers.common["Authorization"] = null);

export const fetchRequestLike = (
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
