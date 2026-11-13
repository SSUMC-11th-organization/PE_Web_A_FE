import { Link } from "@tanstack/react-router";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-canvas/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 w-[min(100%-32px,1280px)] items-center justify-between">
        <Link className="text-xl font-black tracking-tight" to="/" aria-label="UMCINE 홈">
          UMC<span className="text-umc">INE</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-white/60 md:flex" aria-label="주요 메뉴">
          <Link className="text-white" to="/">
            영화
          </Link>
          <span>개봉 예정</span>
          <span>북마크</span>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            className="grid size-10 place-items-center rounded-full transition hover:bg-white/10"
            to="/search"
            search={{ query: "" }}
            aria-label="영화 검색"
          >
            <img className="size-5" src="/icons/search.svg" alt="" />
          </Link>
          <button
            className="grid size-10 place-items-center rounded-full transition hover:bg-white/10"
            type="button"
            aria-label="내 프로필"
          >
            <img className="size-5" src="/icons/person.svg" alt="" />
          </button>
        </div>
      </div>
    </header>
  );
}
