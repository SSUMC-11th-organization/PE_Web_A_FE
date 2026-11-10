import { Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, type SubmitEvent } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";
import { formatRuntime } from "../../utils/movies/format-runtime";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl, getTmdbPosterUrl } from "../../utils/movies/tmdb-image";

const RATINGS = [1, 2, 3, 4, 5];

export function MovieDetailPage() {
  const { movieId: movieIdParam } = useParams({ from: "/movies/$movieId" });
  const movieId = Number(movieIdParam);
  const isValidMovieId = Number.isInteger(movieId) && movieId > 0;

  const movieDetailQuery = useQuery({
    queryKey: ["movies", "detail", movieId],
    queryFn: () => getMovieDetail(movieId),
    enabled: isValidMovieId,
    // 미니 실습: 상세 조회는 전역 기본값(1분) 대신 30초 동안만 fresh로 취급해요.
    staleTime: 30 * 1000,
  });

  // 요청하지 않아도 isPending이 참일 수 있으므로 잘못된 번호를 먼저 처리해요.
  if (!isValidMovieId) {
    return <DetailStatus title="올바르지 않은 영화 번호예요." showBackLink />;
  }

  if (movieDetailQuery.isPending) {
    return <DetailStatus title="영화 정보를 불러오는 중이에요." />;
  }

  if (movieDetailQuery.isError) {
    return (
      <DetailStatus
        title={getMovieDetailErrorMessage(movieDetailQuery.error)}
        showBackLink
      />
    );
  }

  const movie = movieDetailQuery.data;

  // 다른 영화로 이동하면 평점 상태를 초기화해요.
  return <MovieDetail key={movie.id} movie={movie} />;
}

interface DetailStatusProps {
  title: string;
  showBackLink?: boolean;
}

function DetailStatus({ title, showBackLink = false }: DetailStatusProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-10">
      <p className="text-lg font-semibold">{title}</p>
      {showBackLink && (
        <Link to="/" className="text-sm font-semibold text-accent hover:underline">
          영화 목록으로 돌아가기
        </Link>
      )}
    </main>
  );
}

function MovieDetail({ movie }: { movie: TmdbMovieDetail }) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movie.id),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const posterUrl = getTmdbPosterUrl(movie.poster_path);
  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <main className="flex-1">
      <section className="relative isolate flex h-[360px] flex-col justify-between overflow-hidden px-5 pt-6 pb-8 text-white sm:px-12 xl:px-20">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-10 size-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 -z-10 flex items-center justify-center bg-sub text-sm text-white/60">
            이미지 없음
          </div>
        )}
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/80 via-black/30 to-black/10" />

        <Link
          to="/"
          className="flex w-fit items-center gap-1 text-[13px] font-medium text-white/90 hover:text-white"
        >
          <img src="/icons/chevron-left.svg" alt="" className="size-4 invert" />
          영화 목록
        </Link>

        <div className="flex flex-col gap-2">
          <h1 className="text-[40px] leading-tight font-bold tracking-[-0.5px]">
            {movie.title}
          </h1>
          <p className="text-sm text-white/80">{movie.original_title}</p>
          <p className="flex flex-wrap items-center gap-x-3 text-[13px] font-semibold">
            <span>{movie.release_date.replaceAll("-", ".")}</span>
            <span>{movie.genres.map((genre) => genre.name).join(", ")}</span>
            <span>{formatRuntime(movie.runtime)}</span>
          </p>
        </div>
      </section>

      <div className="flex flex-col gap-10 px-5 py-8 sm:px-12 lg:flex-row xl:px-20">
        <section className="flex flex-1 flex-col gap-8 sm:flex-row">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${movie.title} 포스터`}
              className="aspect-2/3 w-[200px] shrink-0 rounded-lg object-cover shadow-lg"
            />
          ) : (
            <div className="flex aspect-2/3 w-[200px] shrink-0 items-center justify-center rounded-lg bg-surface-hover text-sm text-muted shadow-lg">
              이미지 없음
            </div>
          )}

          <div className="flex flex-col items-start gap-3">
            {movie.tagline && <h2 className="text-lg font-bold">{movie.tagline}</h2>}
            <p className="max-w-[640px] text-sm leading-relaxed text-sub">
              {movie.overview}
            </p>
            <button
              type="button"
              aria-pressed={isBookmarked}
              onClick={() => toggleBookmark(movie.id)}
              className={cn(
                "mt-2 flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold text-white transition-[background-color,filter] duration-200 ease-in-out hover:brightness-92",
                isBookmarked ? "bg-text" : "bg-accent",
              )}
            >
              <img
                src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
                alt=""
                className="size-4 invert"
              />
              {isBookmarked ? "즐겨찾기됨" : "즐겨찾기"}
            </button>
          </div>
        </section>

        <aside className="w-full lg:w-[360px] lg:shrink-0 lg:border-l lg:border-border lg:pl-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <h2 className="text-base font-bold">내 평점</h2>
              <p className="text-xs text-muted">별점은 필수, 후기는 선택이에요.</p>
            </div>

            <div className="flex gap-2" role="radiogroup" aria-label="별점">
              {RATINGS.map((score) => {
                const isFilled = score <= rating;

                return (
                  <button
                    key={score}
                    type="button"
                    role="radio"
                    aria-checked={score === rating}
                    aria-label={`${score}점`}
                    onClick={() => setRating(score)}
                    className={cn(
                      "flex size-8 items-center justify-center rounded-md border transition-colors duration-150",
                      isFilled
                        ? "border-accent bg-accent"
                        : "border-border bg-white hover:bg-surface-hover",
                    )}
                  >
                    <img
                      src={isFilled ? "/icons/star.svg" : "/icons/star-outline.svg"}
                      alt=""
                      className={cn("size-4", isFilled ? "invert" : "opacity-60")}
                    />
                  </button>
                );
              })}
            </div>

            <textarea
              value={review}
              onChange={(event) => setReview(event.target.value)}
              placeholder="영화를 보고 느낀 점을 남겨보세요."
              aria-label="후기"
              className="h-[104px] resize-none rounded-lg border border-border bg-white p-3 text-sm outline-none placeholder:text-muted focus:border-accent"
            />

            <button
              type="submit"
              disabled={rating === 0}
              className="rounded-lg bg-text py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              평점 저장
            </button>
          </form>
        </aside>
      </div>
    </main>
  );
}
