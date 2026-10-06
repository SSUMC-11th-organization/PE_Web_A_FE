import { Link } from "@tanstack/react-router";

const NAV_ITEMS = [
  { label: "영화", to: "/" },
  { label: "검색", to: "/search" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-10 h-18 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1280px] items-center gap-10 px-8 max-lg:px-5">
        <Link className="text-[22px] font-bold tracking-[-0.5px]" to="/">
          UM<span className="text-accent">Cine</span>
        </Link>

        <nav className="flex-1 max-sm:hidden" aria-label="주요 메뉴">
          <ul className="flex items-center gap-7">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link
                  className="text-[15px] transition-colors"
                  activeProps={{ className: "font-semibold text-text" }}
                  inactiveProps={{ className: "text-muted hover:text-text" }}
                  activeOptions={{ exact: item.to === "/" }}
                  to={item.to}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <button
            type="button"
            className="h-[38px] rounded-lg border border-border px-4 text-sm transition-colors hover:bg-surface"
          >
            로그인
          </button>
          <button
            type="button"
            className="h-[38px] rounded-lg border border-accent bg-accent px-4 text-sm font-semibold transition-colors hover:border-accent-strong hover:bg-accent-strong"
          >
            회원가입
          </button>
        </div>
      </div>
    </header>
  );
}
