import axios from "axios";

const instance = axios.create({
  baseURL: "https://backend.tagmall.ir/api/v1/",
});

export default instance;
