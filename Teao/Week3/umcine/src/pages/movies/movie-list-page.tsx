import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";

const MOVIES_PER_PAGE = 5;

export function MovieListPage() {
  const [movies, setMovies] = useState(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(movies.length / MOVIES_PER_PAGE);
  const firstMovieIndex = (currentPage - 1) * MOVIES_PER_PAGE;
  const pageMovies = movies.slice(firstMovieIndex, firstMovieIndex + MOVIES_PER_PAGE);

  function handleToggleBookmark(id: number) {
    setMovies((previous) =>
      previous.map((movie) =>
        movie.id === id ? { ...movie, isBookmarked: !movie.isBookmarked } : movie,
      ),
    );
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="mx-auto w-[min(100%-32px,1280px)] py-14 sm:py-20">
      <section className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-2 text-xs font-black tracking-[0.22em] text-umc">UMCINE COLLECTION</p>
          <h1 className="text-3xl font-black sm:text-4xl">영화 목록</h1>
        </div>
        <p className="text-sm text-white/50">총 {movies.length}편</p>
      </section>
      <MovieGrid movies={pageMovies} onToggleBookmark={handleToggleBookmark} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </main>
  );
}
