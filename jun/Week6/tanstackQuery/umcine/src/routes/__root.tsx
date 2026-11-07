import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Footer } from "../components/layout/footer";
import { Header } from "../components/layout/header";

export const Route = createRootRoute({
  component: () => (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  ),
  notFoundComponent: () => (
    <main className="flex flex-1 items-center justify-center p-10 text-muted">
      페이지를 찾을 수 없어요.
    </main>
  ),
});
