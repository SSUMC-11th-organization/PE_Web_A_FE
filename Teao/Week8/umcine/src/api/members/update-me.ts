import { authApi } from "../auth-api";
import type { ApiResponse } from "../models";
import type { MemberInfo } from "./me";

export interface UpdateMeRequest {
  nickname: string;
}

export function updateMe(body: UpdateMeRequest) {
  return authApi.patch("members/me", { json: body }).json<ApiResponse<MemberInfo>>();
}
