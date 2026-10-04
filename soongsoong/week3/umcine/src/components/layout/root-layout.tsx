import { Outlet, useLocation } from "@tanstack/react-router";
import { Header } from "./header";

export function RootLayout() {
  const { pathname } = useLocation();
  // Figma 기준으로 검색 화면에는 푸터가 없어요.
  const hasFooter = pathname !== "/search";

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Outlet />
      {hasFooter && (
        <footer className="border-t border-line bg-white">
          <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center justify-end gap-2 px-4 text-xs text-ink-sub xl:px-0">
            <img className="h-2.5 w-auto" src="/images/logos/tmdb-logo.svg" alt="TMDB" />
            <p>
              This product uses the TMDB API but is not endorsed or certified by{" "}
              <a
                className="underline"
                href="https://www.themoviedb.org"
                target="_blank"
                rel="noreferrer"
              >
                TMDB
              </a>
              .
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}
