import { Navigate, Outlet } from "@tanstack/react-router";
import { useAuthStore } from "../../stores/auth-store";

// 로그인 전용 페이지를 감싸는 공통 레이아웃이에요.
export function AuthenticatedLayout() {
  const accessToken = useAuthStore((state) => state.accessToken);

  // 보고 있는 중에 401로 토큰이 비워지면 바로 로그인 페이지로 이동해요.
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
