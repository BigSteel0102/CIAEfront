import axios from "axios";

const API_URL = "http://localhost:8080/auth_ns";



export const authservice = {
// signup endpoint 로 post request 보내기
  signup: async (data) => {
    return axios.post(API_URL + "/signup", data);
  },
// login endpoint 로 post request
  login: async (data) => {
    const response = await axios.post(API_URL + "/login", data);
    // 유저 정보 확인. 일치하면 백엔드에서 access token refresh token 받기. 존재하는지 확인
    if (response.data.access_token) {
        // store token in local storage
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
    }
    return response.data;
  },

  refreshToken: async () => {
    const refresh_token = localStorage.getItem("refresh_token");
    // if refresh token valid, it returns new access token?
    const response = await axios.post(API_URL + "/refresh", null, {
      headers: { authorization: "Bearer " + refresh_token},
    });
    if (response.data.access_token) {
      localStorage.setItem("access_token", response.data.access_token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
};
