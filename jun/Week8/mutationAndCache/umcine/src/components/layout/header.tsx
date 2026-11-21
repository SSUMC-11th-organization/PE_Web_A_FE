import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { meQueryOptions } from "../../queries/me-query";
import { useAuthStore } from "../../stores/auth-store";
import { cn } from "../../utils/cn";

const NAV_ITEMS = [
  {
    label: "영화",
    to: "/",
    isActive: (pathname: string) =>
      pathname === "/" || pathname.startsWith("/movies"),
  },
  {
    label: "검색",
    to: "/search",
    isActive: (pathname: string) => pathname.startsWith("/search"),
  },
  {
    label: "내 정보",
    to: "/me",
    isActive: (pathname: string) => pathname.startsWith("/me"),
  },
] as const;

const HEADER_BUTTON_CLASS_NAME =
  "rounded-lg bg-accent px-[18px] py-[9px] text-sm font-semibold text-white transition-[filter] duration-200 ease-in-out hover:brightness-92";

export function Header() {
  const pathname = useLocation({ select: (location) => location.pathname });
  const accessToken = useAuthStore((state) => state.accessToken);
  // 토큰이 있을 때만 내 정보를 조회해요. 401이면 토큰이 비워져 로그인 링크로 바뀌어요.
  const meQuery = useQuery({
    ...meQueryOptions,
    enabled: Boolean(accessToken),
  });

  return (
    <header className="flex items-center justify-between border-b border-border bg-white px-5 py-3.5 sm:px-12 xl:px-20">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-[7px] bg-text">
            <img src="/icons/movie.svg" alt="" className="size-4 invert" />
          </span>
          <span className="text-lg font-bold tracking-[-0.3px] text-text">
            UMCine
          </span>
        </Link>

        <nav className="flex items-center gap-5">
          {NAV_ITEMS.map((item) => {
            const active = item.isActive(pathname);

            return (
              <Link
                key={item.label}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-sm transition-colors",
                  active
                    ? "font-bold text-text underline underline-offset-4"
                    : "font-medium text-muted hover:text-text",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/search"
          className="flex size-9 items-center justify-center rounded-full transition-colors duration-200 ease-in-out hover:bg-surface-hover"
          aria-label="검색"
        >
          <img src="/icons/search.svg" alt="" className="size-[18px] opacity-70" />
        </Link>
        {/* 토큰이 없으면 로그인, 첫 조회 중이면 로딩, 그 외에는 마이페이지를 보여줘요. */}
        {!accessToken ? (
          <Link to="/login" className={HEADER_BUTTON_CLASS_NAME}>
            로그인
          </Link>
        ) : meQuery.isLoading ? (
          <span
            role="status"
            aria-label="내 정보를 불러오는 중"
            className="h-10 w-24 animate-pulse rounded-lg bg-gray-200"
          />
        ) : (
          <Link to="/me" className={HEADER_BUTTON_CLASS_NAME}>
            마이페이지
          </Link>
        )}
      </div>
    </header>
  );
}
