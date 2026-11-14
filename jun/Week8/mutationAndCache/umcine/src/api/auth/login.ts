import { apiClient } from "../api-client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    nickname: string;
    accessToken: string;
  };
}

// 로그인은 인증이 필요 없으므로 apiClient로 요청해요.
export function login(body: LoginRequest) {
  return apiClient.post("auth/login", { json: body }).json<LoginResponse>();
}
