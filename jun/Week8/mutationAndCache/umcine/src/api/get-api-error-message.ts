import { isHTTPError } from "ky";

interface ApiErrorBody {
  isSuccess: false;
  code: string;
  message: string;
}

function isApiErrorBody(data: unknown): data is ApiErrorBody {
  return (
    typeof data === "object" &&
    data !== null &&
    "message" in data &&
    typeof data.message === "string"
  );
}

/**
 * 서버가 공통 응답 형식으로 보낸 실패 메시지를 꺼내요.
 * 네트워크 오류처럼 응답 본문이 없으면 fallback을 돌려줘요.
 */
export function getApiErrorMessage(error: unknown, fallback: string) {
  if (isHTTPError(error) && isApiErrorBody(error.data)) {
    return error.data.message;
  }
  return fallback;
}
