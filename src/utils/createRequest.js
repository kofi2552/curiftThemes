import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_LIVE_URL;
const localUrl = "http://localhost:3000";

const createRequest = axios.create({
  baseURL: apiUrl,
  //baseURL: localUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default createRequest;
