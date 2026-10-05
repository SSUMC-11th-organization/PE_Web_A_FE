import { Outlet } from "@tanstack/react-router";
import Header from "./header";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_15%_8%,rgba(95,65,210,0.14),transparent_30%)]">
      <Header />
      <Outlet />
      <footer className="mx-auto flex w-[min(100%-32px,1280px)] items-center justify-between border-t border-white/10 py-10 text-sm text-white/40">
        <p>영화 정보 제공</p>
        <img className="h-4 opacity-60" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
      </footer>
    </div>
  );
}
