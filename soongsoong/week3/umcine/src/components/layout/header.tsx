import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "../../utils/cn";

const navLinkClassName = "text-sm font-medium text-ink-sub";
const navLinkActiveClassName = "font-bold text-ink underline underline-offset-4";

export function Header() {
  const { pathname } = useLocation();
  const isMoviesActive = pathname === "/" || pathname.startsWith("/movies/");
  const isSearchActive = pathname === "/search";

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex h-[88px] w-full max-w-[1280px] items-center px-4 xl:px-0">
        <Link
          className="flex items-center gap-2.5 text-xl font-extrabold tracking-[-0.4px] text-ink"
          to="/"
        >
          <span className="flex size-8 items-center justify-center rounded-lg border-2 border-ink">
            <img className="size-[22px]" src="/icons/movie.svg" alt="" />
          </span>
          UMCine
        </Link>

        <nav>
          <ul className="ml-11 flex gap-[30px]">
            <li>
              <Link
                className={cn(navLinkClassName, isMoviesActive && navLinkActiveClassName)}
                to="/"
              >
                영화
              </Link>
            </li>
            <li>
              <Link
                className={cn(navLinkClassName, isSearchActive && navLinkActiveClassName)}
                to="/search"
              >
                검색
              </Link>
            </li>
            <li>
              <span className={navLinkClassName}>내 정보</span>
            </li>
          </ul>
        </nav>

        <div className="ml-auto flex gap-3">
          <Link
            className="flex size-10 items-center justify-center rounded-lg border border-line bg-white"
            to="/search"
            aria-label="검색"
          >
            <img src="/icons/search.svg" alt="" width={24} height={24} />
          </Link>
          <button
            className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-bold text-white"
            type="button"
          >
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
