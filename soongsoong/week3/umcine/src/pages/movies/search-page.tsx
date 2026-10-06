import { useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { MovieGrid } from "../../components/movies/movie-grid";
import { movies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function SearchPage() {
  const { query } = useSearch({ from: "/search" });
  const navigate = useNavigate({ from: "/search" });
  const [searchText, setSearchText] = useState(query ?? "");
  const [prevQuery, setPrevQuery] = useState(query);

  // URL의 검색어가 바뀌면 입력창도 그 값으로 맞춰요.
  if (query !== prevQuery) {
    setPrevQuery(query);
    setSearchText(query ?? "");
  }

  const bookmarkedMovieIds = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const normalizedQuery = query?.trim().toLowerCase() ?? "";
  const searchResults = normalizedQuery
    ? movies
        .filter(
          (movie) =>
            movie.title.toLowerCase().includes(normalizedQuery) ||
            movie.originalTitle.toLowerCase().includes(normalizedQuery),
        )
        .map((movie) => ({ ...movie, isBookmarked: bookmarkedMovieIds.includes(movie.id) }))
    : [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchText.trim();
    navigate({
      search: nextQuery ? { query: nextQuery } : {},
    });
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 pt-[208px] pb-20 xl:px-0">
      <h1 className="text-center text-[44px] font-extrabold tracking-[-1.32px]">
        어떤 영화를 찾고 있나요?
      </h1>

      <form
        className="mx-auto mt-10 flex h-[74px] w-full max-w-[788px] items-center gap-3 rounded-xl border-2 border-ink bg-white pr-4 pl-6 shadow-[0_12px_24px_rgba(17,24,39,0.08)]"
        role="search"
        onSubmit={handleSubmit}
      >
        <img className="opacity-70" src="/icons/search.svg" alt="" width={24} height={24} />
        <input
          className="h-full min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-muted"
          type="search"
          placeholder="예: 스파이더맨"
          aria-label="검색어"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <button
          className="h-[42px] rounded-lg bg-ink px-[18px] text-sm font-bold text-white"
          type="submit"
        >
          검색
        </button>
      </form>

      {normalizedQuery ? (
        <section className="mt-16">
          <h2 className="mb-5 text-xl leading-normal font-extrabold">
            ‘{query}’ 검색 결과 {searchResults.length}편
          </h2>
          {searchResults.length > 0 ? (
            <MovieGrid movies={searchResults} onToggleBookmark={toggleBookmark} showDetails />
          ) : (
            <p className="py-10 text-center text-sm leading-normal text-ink-sub">검색 결과가 없어요.</p>
          )}
        </section>
      ) : (
        <p className="mt-16 py-10 text-center text-sm leading-normal text-ink-sub">
          검색어를 입력해 주세요.
        </p>
      )}
    </main>
  );
}
