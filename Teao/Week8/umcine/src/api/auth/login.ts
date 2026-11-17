import type { ApiResponse } from "../models";
import { apiClient } from "../api-client";

export interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResult {
  nickname: string;
  accessToken: string;
}

export function login(body: LoginRequest) {
  return apiClient.post("auth/login", { json: body }).json<ApiResponse<LoginResult>>();
}
