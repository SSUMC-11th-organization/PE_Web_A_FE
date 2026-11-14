import { apiClient } from "../api-client";

export interface CheckNicknameDuplicateResult {
  available: boolean;
}

interface CheckNicknameDuplicateResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: CheckNicknameDuplicateResult;
}

// 서버는 공통 응답 형식의 result 안에 available을 담아 보내요.
export async function checkNicknameDuplicate(
  nickname: string,
): Promise<CheckNicknameDuplicateResult> {
  const response = await apiClient
    .get(`members/nickname/${encodeURIComponent(nickname)}`)
    .json<CheckNicknameDuplicateResponse>();
  return response.result;
}
