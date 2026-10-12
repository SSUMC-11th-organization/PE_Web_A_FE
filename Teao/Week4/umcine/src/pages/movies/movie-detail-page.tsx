import { Link, useParams } from "@tanstack/react-router";
import { BookmarkButton } from "../../components/bookmark-button";
import { movies } from "../../data/movies";

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const movie = movies.find(({ id }) => id === Number(movieId));

  if (!movie) {
    return (
      <main className="mx-auto grid min-h-[calc(100vh-180px)] w-[min(100%-32px,1280px)] place-items-center py-20">
        <div className="text-center">
          <h1 className="text-3xl font-black">영화를 찾을 수 없어요.</h1>
          <Link className="mt-6 inline-block rounded-full bg-umc px-6 py-3 font-bold" to="/">
            목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative isolate min-h-[calc(100vh-72px)] overflow-hidden">
      <img className="absolute inset-0 -z-20 size-full object-cover" src={movie.backdropPath} alt="" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(13,13,16,0.98)_0%,rgba(13,13,16,0.82)_48%,rgba(13,13,16,0.35)_100%),linear-gradient(0deg,#0d0d10_0%,transparent_45%)]" />
      <section className="mx-auto flex min-h-[calc(100vh-72px)] w-[min(100%-32px,1280px)] items-center py-16">
        <div className="max-w-2xl">
          <p className="font-bold tracking-[0.18em] text-umc">NOW SHOWING</p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">{movie.title}</h1>
          <p className="mt-3 text-lg text-white/55">{movie.originalTitle}</p>
          <div className="mt-7 flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm" key={genre}>
                {genre}
              </span>
            ))}
          </div>
          <p className="mt-7 text-sm font-semibold text-white/65">
            {movie.releaseDate} · {movie.runtime}
          </p>
          <p className="mt-7 text-xl font-bold">{movie.tagline}</p>
          <p className="mt-4 max-w-xl text-base leading-8 text-white/65">{movie.overview}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <BookmarkButton
              className="px-7 py-3.5"
              movieId={movie.id}
              showLabel
              title={movie.title}
            />
            <Link className="inline-flex rounded-full bg-umc px-7 py-3.5 font-bold transition hover:brightness-110" to="/">
              영화 목록
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
