import { useState } from "react";
import MovieGrid from "../../components/movies/movie-grid";
import Pagination from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";

const MOVIES_PER_PAGE = 10;

export function MovieListPage() {
  const [movies, setMovies] = useState(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(movies.length / MOVIES_PER_PAGE));

  function handleToggleBookmark(id: number) {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === id
          ? { ...movie, isBookmarked: !movie.isBookmarked }
          : movie
      )
    );
  }

  const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
  const pageMovies = movies.slice(startIndex, startIndex + MOVIES_PER_PAGE);

  return (
    <main className="flex-1 px-5 pt-6 pb-10 sm:px-12 sm:pt-10 sm:pb-16 xl:px-20">
      <section>
        <h1 className="mb-6 text-[28px] font-bold tracking-[-0.3px]">영화 목록</h1>

        <MovieGrid movies={pageMovies} onToggleBookmark={handleToggleBookmark} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </section>
    </main>
  );
}
