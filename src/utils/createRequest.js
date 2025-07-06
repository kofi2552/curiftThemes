import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_LIVE_URL || "http://localhost:3000";

const createRequest = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "with-credentials": "true",
  },
});

export default createRequest;
