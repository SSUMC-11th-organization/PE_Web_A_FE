import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import type { TmdbMovieDetail } from "../../api/movies/models";
import { BookmarkButton } from "../../components/bookmark-button";
import { getMovieDetailErrorMessage } from "../../utils/movies/get-movie-detail-error-message";
import { getTmdbBackdropUrl } from "../../utils/movies/tmdb-image";

function formatRuntime(runtime: number | null) {
  if (runtime === null) return "상영 시간 정보가 없어요.";
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
}

export function MovieDetailPage() {
  const { movieId } = useParams({ from: "/movies/$movieId" });
  const parsedMovieId = Number(movieId);
  const isValidMovieId = Number.isInteger(parsedMovieId) && parsedMovieId > 0;
  const [movie, setMovie] = useState<TmdbMovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(isValidMovieId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    if (!isValidMovieId) {
      return;
    }

    async function loadMovieDetail() {
      setMovie(null);
      setErrorMessage(null);
      setIsLoading(true);

      try {
        const response = await getMovieDetail(parsedMovieId);
        if (!ignore) setMovie(response);
      } catch (error: unknown) {
        if (!ignore) setErrorMessage(getMovieDetailErrorMessage(error));
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    void loadMovieDetail();

    return () => {
      ignore = true;
    };
  }, [isValidMovieId, parsedMovieId]);

  if (!isValidMovieId) {
    return (
      <main className="mx-auto grid min-h-[calc(100vh-180px)] w-[min(100%-32px,1280px)] place-items-center py-20">
        <div className="text-center">
          <h1 className="text-3xl font-black">올바르지 않은 영화 번호예요.</h1>
          <Link className="mt-6 inline-block rounded-full bg-umc px-6 py-3 font-bold" to="/">
            목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return <main className="grid min-h-[calc(100vh-180px)] place-items-center">영화 정보를 불러오는 중이에요.</main>;
  }

  if (errorMessage || !movie) {
    return <main className="grid min-h-[calc(100vh-180px)] place-items-center text-red-300">{errorMessage ?? "영화 정보를 불러오지 못했어요."}</main>;
  }

  const backdropUrl = getTmdbBackdropUrl(movie.backdrop_path);

  return (
    <main className="relative isolate min-h-[calc(100vh-72px)] overflow-hidden">
      {backdropUrl ? (
        <img className="absolute inset-0 -z-20 size-full object-cover" src={backdropUrl} alt="" />
      ) : (
        <div className="absolute inset-0 -z-20 grid place-items-center bg-white/5 text-white/30">이미지 없음</div>
      )}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(13,13,16,0.98)_0%,rgba(13,13,16,0.82)_48%,rgba(13,13,16,0.35)_100%),linear-gradient(0deg,#0d0d10_0%,transparent_45%)]" />
      <section className="mx-auto flex min-h-[calc(100vh-72px)] w-[min(100%-32px,1280px)] items-center py-16">
        <div className="max-w-2xl">
          <p className="font-bold tracking-[0.18em] text-umc">NOW SHOWING</p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">{movie.title}</h1>
          <p className="mt-3 text-lg text-white/55">{movie.original_title}</p>
          <div className="mt-7 flex flex-wrap gap-2">
            {movie.genres.map((genre) => (
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm" key={genre.id}>
                {genre.name}
              </span>
            ))}
          </div>
          <p className="mt-7 text-sm font-semibold text-white/65">
            {movie.release_date || "개봉일 미정"} · {formatRuntime(movie.runtime)}
          </p>
          {movie.tagline && <p className="mt-7 text-xl font-bold">{movie.tagline}</p>}
          <p className="mt-4 max-w-xl text-base leading-8 text-white/65">
            {movie.overview || "줄거리 정보가 없어요."}
          </p>
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
