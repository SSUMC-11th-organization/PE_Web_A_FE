import { Link, useLocation } from "@tanstack/react-router";
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
  { label: "내 정보", to: "/", isActive: () => false },
] as const;

export function Header() {
  const pathname = useLocation({ select: (location) => location.pathname });

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
        <button
          type="button"
          className="rounded-lg bg-accent px-[18px] py-[9px] text-sm font-semibold text-white transition-[filter] duration-200 ease-in-out hover:brightness-92"
        >
          로그인
        </button>
      </div>
    </header>
  );
}
