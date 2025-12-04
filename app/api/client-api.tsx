import axios from "axios";

const clientApi = axios.create({
    baseURL: "http://localhost:5520/api/v1",
    timeout: 8000,
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