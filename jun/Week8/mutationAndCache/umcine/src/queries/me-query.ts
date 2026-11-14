import { queryOptions } from "@tanstack/react-query";
import { getMe } from "../api/members/me";

export const meQueryKey = ["members", "me"] as const;

// 헤더, 마이페이지, 내 정보 수정이 같은 옵션으로 같은 캐시를 함께 써요.
export const meQueryOptions = queryOptions({
  queryKey: meQueryKey,
  queryFn: getMe,
  // 내 정보는 자주 바뀌지 않으므로 5분 동안 fresh로 취급해요.
  staleTime: 5 * 60 * 1000,
  // 401로 토큰을 비운 뒤 같은 요청을 다시 보내지 않도록 재시도를 꺼요.
  retry: false,
});
