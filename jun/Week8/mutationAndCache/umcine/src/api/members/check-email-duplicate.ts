import { apiClient } from "../api-client";

export interface CheckEmailDuplicateResult {
  available: boolean;
}

interface CheckEmailDuplicateResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: CheckEmailDuplicateResult;
}

// 서버는 공통 응답 형식의 result 안에 available을 담아 보내요.
export async function checkEmailDuplicate(
  email: string,
): Promise<CheckEmailDuplicateResult> {
  const response = await apiClient
    .get(`members/email/${encodeURIComponent(email)}`)
    .json<CheckEmailDuplicateResponse>();
  return response.result;
}
