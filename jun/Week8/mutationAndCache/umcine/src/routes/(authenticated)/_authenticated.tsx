import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthenticatedLayout } from "../../components/layout/authenticated-layout";
import { useAuthStore } from "../../stores/auth-store";

// (authenticated) 폴더는 주소에 나타나지 않는 Route Group이고,
// _authenticated는 주소 없이 하위 페이지를 감싸는 Layout Route예요.
// 이 아래에 둔 페이지는 모두 로그인해야 볼 수 있어요.
export const Route = createFileRoute("/(authenticated)/_authenticated")({
  // 페이지를 보여주기 전에 토큰이 없으면 로그인 페이지로 보내요.
  beforeLoad: () => {
    if (!useAuthStore.getState().accessToken) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthenticatedLayout,
});
