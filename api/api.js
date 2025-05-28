// ✅ /api/api.js

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// 공통 API base URL
export const BASE_URL = "https://6735-203-237-172-113.ngrok-free.app";
export const AI_URL = "https://fed5-104-199-243-187.ngrok-free.app";

// axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 설정
apiClient.interceptors.request.use(async (config) => {
  if (
    config.url.includes("/auth/login") ||
    config.url.includes("/auth/signup")
  ) {
    return config; // 로그인/회원가입 요청엔 토큰 제외
  }

  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
