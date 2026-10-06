import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import type { SubmitEvent } from "react";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { movies } from "../../data/movies";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });

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
    const formData = new FormData(event.currentTarget);
    const nextQuery = String(formData.get("query") ?? "").trim();
    navigate({ search: nextQuery ? { query: nextQuery } : {} });
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] px-8 pt-12 pb-20 max-lg:px-5 max-sm:pt-8">
      <div className="mb-8">
        <h1 className="text-[32px] font-bold tracking-[-0.8px] max-sm:text-[26px]">
          영화 검색
        </h1>
        <p className="mt-2 text-[15px] text-muted">
          보고 싶은 영화의 제목을 검색해 보세요.
        </p>
      </div>

      <form className="mb-10 flex gap-2" onSubmit={handleSubmit}>
        <input
          key={query ?? ""}
          name="query"
          defaultValue={query ?? ""}
          className="h-12 w-full max-w-[520px] rounded-lg border border-border bg-surface px-4 text-[15px] placeholder:text-muted"
          aria-label="검색어"
          placeholder="영화 제목 또는 원제를 입력하세요"
        />
        <button
          className="h-12 rounded-lg border border-accent bg-accent px-6 text-[15px] font-semibold transition-colors hover:border-accent-strong hover:bg-accent-strong"
          type="submit"
        >
          검색
        </button>
      </form>

      {!normalizedQuery ? (
        <p className="py-20 text-center text-muted">검색어를 입력해 주세요.</p>
      ) : (
        <>
          <div className="mb-6 flex items-baseline gap-3">
            <h2 className="text-xl font-semibold">‘{query}’ 검색 결과</h2>
            <p className="text-sm text-muted">영화 {searchResults.length}편</p>
          </div>

          {searchResults.length === 0 ? (
            <p className="py-20 text-center text-muted">검색 결과가 없어요.</p>
          ) : (
            <ul className="flex flex-col gap-6">
              {searchResults.map((movie) => (
                <li
                  key={movie.id}
                  className="flex gap-5 rounded-xl border border-border bg-surface p-5 max-sm:flex-col"
                >
                  <img
                    className="h-[210px] w-[140px] shrink-0 rounded-lg object-cover max-sm:w-full"
                    src={movie.posterPath}
                    alt={`${movie.title} 포스터`}
                    loading="lazy"
                  />
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold">{movie.title}</h3>
                      <BookmarkButton
                        movieId={movie.id}
                        movieTitle={movie.title}
                        className="size-9 shrink-0 rounded-full border border-border"
                      />
                    </div>
                    <p className="text-sm text-muted">{movie.originalTitle}</p>
                    <p className="text-sm text-muted">{movie.releaseDate}</p>
                    <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-text/85">
                      {movie.overview}
                    </p>
                    <Link
                      className="mt-auto w-fit rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-bg"
                      to="/movies/$movieId"
                      params={{ movieId: String(movie.id) }}
                    >
                      상세 보기
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  );
}
