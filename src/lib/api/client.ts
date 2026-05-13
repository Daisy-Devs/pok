import axios, { AxiosResponse } from "axios";

const client= axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,       // sends httpOnly cookie automatically
  adapter: 'fetch', 
  timeout: 20_000,
  headers: {
    "X-Requested-With": "XMLHttpRequest", // helps backend identify AJAX requests
  },
})
client.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});
client.interceptors.response.use(
  (response:AxiosResponse) => response.data,
  error => {
    return Promise.reject(error);
}
);

export default client