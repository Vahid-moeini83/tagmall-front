import axios from "axios";

const instance = axios.create({
  baseURL: "http://backend.tagmall.ir/api/v1/",
});

export default instance;
 