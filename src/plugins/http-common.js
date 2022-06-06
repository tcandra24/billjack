import axios from "axios";
export default axios.create({
  baseURL: import.meta.env.VITE_URL,
  headers: {
    "Content-type": "application/json",
  },
});
