import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { type CardSize, useViewStore } from "../../stores/view-store";
import { cn } from "../../utils/cn";

const TOTAL_PAGES = 5;

const CARD_SIZE_OPTIONS: { label: string; value: CardSize }[] = [
  { label: "보통", value: "normal" },
  { label: "크게", value: "large" },
];

export function MovieListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const bookmarkedCount = useBookmarkStore(
    (state) => state.bookmarkedMovieIds.length,
  );
  const cardSize = useViewStore((state) => state.cardSize);
  const setCardSize = useViewStore((state) => state.setCardSize);

  return (
    <main className="mx-auto w-full max-w-[1280px] px-8 pt-12 pb-20 max-lg:px-5 max-sm:pt-8">
      <div className="mb-8 flex items-end justify-between gap-4 max-sm:flex-col max-sm:items-start">
        <div>
          <h1 className="text-[32px] font-bold tracking-[-0.8px] max-sm:text-[26px]">
            영화 목록
          </h1>
          <p className="mt-2 text-[15px] text-muted">
            지금 가장 주목받는 영화 {movies.length}편 중 {bookmarkedCount}편을
            북마크했어요.
          </p>
        </div>

        <div
          className="flex items-center gap-1 rounded-lg border border-border p-1"
          role="group"
          aria-label="카드 크기"
        >
          {CARD_SIZE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                cardSize === option.value
                  ? "bg-accent font-semibold text-white"
                  : "text-muted hover:text-text",
              )}
              aria-pressed={cardSize === option.value}
              onClick={() => setCardSize(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <MovieGrid movies={movies} />

      <Pagination
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onChangePage={setCurrentPage}
      />
    </main>
  );
}
