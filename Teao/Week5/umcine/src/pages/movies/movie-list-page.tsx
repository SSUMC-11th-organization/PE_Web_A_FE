import { useEffect, useState } from "react";
import { getMovies } from "../../api/movies/get-movies";
import type { TmdbMovieListItem } from "../../api/movies/models";
import MovieGrid from "../../components/movies/movie-grid";

export function MovieListPage() {
  const [movies, setMovies] = useState<TmdbMovieListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadMovies() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await getMovies({ page: 1 });
        if (!ignore) setMovies(response.results);
      } catch {
        if (!ignore) setErrorMessage("영화 목록을 불러오지 못했어요.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    void loadMovies();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="mx-auto w-[min(100%-32px,1280px)] py-14 sm:py-20">
      <section className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-2 text-xs font-black tracking-[0.22em] text-umc">UMCINE COLLECTION</p>
          <h1 className="text-3xl font-black sm:text-4xl">영화 목록</h1>
        </div>
        <p className="text-sm text-white/50">총 {movies.length}편</p>
      </section>
      {isLoading ? (
        <p className="py-20 text-center text-white/50">영화 목록을 불러오는 중이에요.</p>
      ) : errorMessage ? (
        <p className="py-20 text-center text-red-300">{errorMessage}</p>
      ) : movies.length === 0 ? (
        <p className="py-20 text-center text-white/50">조건에 맞는 영화가 없어요.</p>
      ) : (
        <MovieGrid movies={movies} />
      )}
    </main>
  );
}
