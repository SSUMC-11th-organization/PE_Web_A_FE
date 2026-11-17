import { authApi } from "../auth-api";
import type { ApiResponse } from "../models";

export interface MemberInfo {
  email: string;
  nickname: string;
  createdAt: string;
}

export async function getMe(): Promise<MemberInfo> {
  const response = await authApi.get("members/me").json<ApiResponse<MemberInfo>>();
  return response.result;
}
