import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const [prevQuery, setPrevQuery] = useState(query);

  // URL의 query가 바뀌면(뒤로 가기 등) 입력창도 맞춰요.
  if (query !== prevQuery) {
    setPrevQuery(query);
    setSearchText(query ?? "");
  }

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const searchResults = normalizedQuery
    ? movies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(normalizedQuery) ||
          movie.originalTitle.toLowerCase().includes(normalizedQuery),
      )
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  const hasQuery = normalizedQuery !== "";

  return (
    <main
      className={cn(
        "flex flex-1 flex-col px-5 sm:px-12 xl:px-20",
        hasQuery ? "gap-6 pt-6 pb-10 sm:pt-10 sm:pb-16" : "items-center pt-32 pb-16 sm:pt-48",
      )}
    >
      <h1
        className={cn(
          "font-bold tracking-[-0.3px]",
          hasQuery ? "text-[28px]" : "text-center text-[32px]",
        )}
      >
        {hasQuery ? "영화 검색" : "어떤 영화를 찾고 있나요?"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex w-full items-center gap-2 rounded-xl border bg-white pr-2 pl-4 transition-colors focus-within:border-accent",
          hasQuery
            ? "h-12 border-border"
            : "mt-8 h-16 max-w-[800px] border-text shadow-lg",
        )}
      >
        <img src="/icons/search.svg" alt="" className="size-5 shrink-0 opacity-60" />
        <input
          aria-label="검색어"
          value={searchText}
          placeholder="예: 스파이더맨"
          onChange={(event) => setSearchText(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
        />
        {hasQuery && searchText && (
          <button
            type="button"
            aria-label="검색어 지우기"
            onClick={() => setSearchText("")}
            className="flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-surface-hover"
          >
            <img src="/icons/close.svg" alt="" className="size-4 opacity-60" />
          </button>
        )}
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-text px-3.5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-85"
        >
          {hasQuery ? "다시 검색" : "검색"}
        </button>
      </form>

      {hasQuery && (
        <section className="flex flex-col">
          <div className="flex items-baseline justify-between border-b border-border pb-3">
            <h2 className="text-sm font-bold">‘{query}’ 검색 결과</h2>
            <p className="text-xs text-muted">영화 {searchResults.length}편</p>
          </div>

          {searchResults.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-20 text-center">
              <p className="font-semibold">검색 결과가 없어요.</p>
              <p className="text-sm text-muted">다른 검색어로 다시 찾아보세요.</p>
            </div>
          ) : (
            <ul className="grid gap-x-12 md:grid-cols-2">
              {searchResults.map((movie) => (
                <SearchResultItem key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}

function SearchResultItem({ movie }: { movie: Movie }) {
  return (
    <li className="flex gap-5 border-b border-border py-6">
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="shrink-0"
      >
        <img
          src={movie.posterPath}
          alt={`${movie.title} 포스터`}
          className="aspect-2/3 w-32 rounded-lg object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-col items-start gap-1.5 pt-1">
        <h3 className="text-base font-bold">{movie.title}</h3>
        <p className="text-xs text-muted">
          {movie.originalTitle} · {movie.releaseDate}
        </p>
        <p className="line-clamp-2 text-[13px] leading-relaxed text-sub">
          {movie.overview}
        </p>
        <Link
          to="/movies/$movieId"
          params={{ movieId: String(movie.id) }}
          className="mt-2 text-xs font-semibold text-accent hover:underline"
        >
          상세 보기 →
        </Link>
      </div>
    </li>
  );
}
