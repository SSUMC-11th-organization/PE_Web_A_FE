import { useAuthStore } from "../stores/auth-store";
import { getMemberIdFromToken } from "../utils/auth/get-member-id-from-token";

/** 로그인한 회원의 memberId. 로그인 전이면 null이에요. */
export function useMyMemberId() {
  return useAuthStore((state) => getMemberIdFromToken(state.accessToken));
}
