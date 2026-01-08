import axios from "axios";

const clientApi = axios.create({
    baseURL: "http://10.200.2.92:3535/api/v1",
    // timeout: 8000,
});

// 共通処理
clientApi.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err);
    return Promise.reject(err);
  }
);

export default clientApi;