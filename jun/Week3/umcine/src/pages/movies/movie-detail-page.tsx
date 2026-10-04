import { Link, useParams } from "@tanstack/react-router";
import { useState, type SubmitEvent } from "react";
import { movies } from "../../data/movies";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

const RATINGS = [1, 2, 3, 4, 5];

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-10">
        <p className="text-lg font-semibold">영화를 찾을 수 없어요.</p>
        <Link to="/" className="text-sm font-semibold text-accent hover:underline">
          영화 목록으로 돌아가기
        </Link>
      </main>
    );
  }

  // 다른 영화로 이동하면 즐겨찾기와 평점 상태를 초기화해요.
  return <MovieDetail key={movie.id} movie={movie} />;
}

function MovieDetail({ movie }: { movie: Movie }) {
  const [isBookmarked, setIsBookmarked] = useState(movie.isBookmarked);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <main className="flex-1">
      <section className="relative isolate flex h-[360px] flex-col justify-between overflow-hidden px-5 pt-6 pb-8 text-white sm:px-12 xl:px-20">
        <img
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 size-full object-cover"
        />
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
          <p className="text-sm text-white/80">{movie.originalTitle}</p>
          <p className="flex flex-wrap items-center gap-x-3 text-[13px] font-semibold">
            <span>{movie.releaseDate}</span>
            <span>{movie.genres.join(" · ")}</span>
            <span>{movie.runtime}</span>
          </p>
        </div>
      </section>

      <div className="flex flex-col gap-10 px-5 py-8 sm:px-12 lg:flex-row xl:px-20">
        <section className="flex flex-1 flex-col gap-8 sm:flex-row">
          <img
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
            className="aspect-2/3 w-[200px] shrink-0 rounded-lg object-cover shadow-lg"
          />

          <div className="flex flex-col items-start gap-3">
            <h2 className="text-lg font-bold">{movie.tagline}</h2>
            <p className="max-w-[640px] text-sm leading-relaxed text-sub">
              {movie.overview}
            </p>
            <button
              type="button"
              aria-pressed={isBookmarked}
              onClick={() => setIsBookmarked((prev) => !prev)}
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
