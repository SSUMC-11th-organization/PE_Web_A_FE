import { Outlet, useRouterState } from "@tanstack/react-router";
import { MemberPage } from "./member-page";

export function MypageRoutePage() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return pathname === "/mypage" ? <MemberPage /> : <Outlet />;
}
