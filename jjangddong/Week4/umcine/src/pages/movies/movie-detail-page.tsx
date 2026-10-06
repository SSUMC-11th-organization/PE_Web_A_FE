import { Link, useParams } from "@tanstack/react-router";
import { BookmarkButton } from "../../components/movies/bookmark-button";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find((item) => item.id === Number(movieId));

  if (!movie) {
    return (
      <main className="mx-auto w-full max-w-[1280px] px-8 py-20 text-center text-muted">
        영화를 찾을 수 없어요.
      </main>
    );
  }

  return (
    <main className="relative">
      <div className="absolute inset-x-0 top-0 h-[520px] overflow-hidden">
        <img
          className="size-full object-cover"
          src={movie.backdropPath}
          alt=""
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/80 to-bg" />
      </div>

      <div className="relative mx-auto w-full max-w-[1280px] px-8 pt-12 pb-20 max-lg:px-5">
        <Link
          className="inline-block rounded-lg border border-border bg-bg/60 px-4 py-2 text-sm backdrop-blur-sm transition-colors hover:bg-surface"
          to="/"
        >
          영화 목록
        </Link>

        <div className="mt-10 flex gap-10 max-md:flex-col max-md:gap-6">
          <img
            className="h-[420px] w-[280px] shrink-0 rounded-xl object-cover shadow-2xl max-md:h-auto max-md:w-[200px]"
            src={movie.posterPath}
            alt={`${movie.title} 포스터`}
          />

          <div className="flex flex-col gap-3 pt-4">
            <h1 className="text-[40px] leading-tight font-bold tracking-[-1px] max-sm:text-[28px]">
              {movie.title}
            </h1>
            <p className="text-base text-muted">{movie.originalTitle}</p>
            <p className="text-sm text-muted">
              {movie.releaseDate} · {movie.genres.join(" · ")} · {movie.runtime}
            </p>
            <h2 className="mt-4 text-xl font-semibold text-accent">
              {movie.tagline}
            </h2>
            <p className="max-w-[640px] leading-relaxed text-text/85">
              {movie.overview}
            </p>

            <BookmarkButton
              movieId={movie.id}
              movieTitle={movie.title}
              className="mt-4 h-12 w-fit rounded-lg border border-border px-5"
              showLabel
            />
          </div>
        </div>
      </div>
    </main>
  );
}
