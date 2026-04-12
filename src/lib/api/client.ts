import axios, { AxiosResponse } from "axios";

const client= axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,       // sends httpOnly cookie automatically
  adapter: 'fetch', 
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest", // helps backend identify AJAX requests
  },
})

client.interceptors.response.use(
  (response:AxiosResponse) => response.data,
  error => {
    const status = error.response?.status;
    if (status === 401) {
      // Handle unauthorized access, e.g., redirect to sign in page
      window.location.href = "/sign-in";
    }
    if (status === 403) {
      // Handle forbidden access, e.g., show an error message
      alert("You do not have permission to perform this action.");
    }
    return Promise.reject(error.message);
}
);

export default client