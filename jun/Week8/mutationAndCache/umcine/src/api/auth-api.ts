import { useAuthStore } from "../stores/auth-store";
import { apiClient } from "./api-client";

// apiClient 설정을 이어받고, 인증이 필요한 요청에만 토큰을 붙여요.
export const authApi = apiClient.extend({
  hooks: {
    beforeRequest: [
      ({ request }) => {
        // 컴포넌트 밖이므로 getState()로 요청 시점의 최신 토큰을 읽어요.
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      ({ response }) => {
        // 토큰이 없거나 만료·위조되었다면 비워서 로그인 전 상태로 되돌려요.
        if (response.status === 401) {
          useAuthStore.getState().setAccessToken(null);
        }
      },
    ],
  },
});
