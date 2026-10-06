import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
    </>
  ),
  notFoundComponent: () => (
    <main className="mx-auto w-full max-w-[1280px] px-8 py-20 text-center text-muted">
      페이지를 찾을 수 없어요.
    </main>
  ),
});
