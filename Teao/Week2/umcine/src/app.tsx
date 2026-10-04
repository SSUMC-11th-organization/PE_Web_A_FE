import { useState } from "react";
import Header from "./components/header";
import MovieGrid from "./components/movie-grid";
import Pagination from "./components/pagination";
import { movies as initialMovies } from "./data/movies";
import "./app.css";

const MOVIES_PER_PAGE = 5;

export default function App() {
  const [movies, setMovies] = useState(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(movies.length / MOVIES_PER_PAGE);
  const firstMovieIndex = (currentPage - 1) * MOVIES_PER_PAGE;
  const pageMovies = movies.slice(firstMovieIndex, firstMovieIndex + MOVIES_PER_PAGE);

  function handleToggleBookmark(id: number) {
    setMovies((prevMovies) =>
      prevMovies.map((movie) =>
        movie.id === id ? { ...movie, isBookmarked: !movie.isBookmarked } : movie,
      ),
    );
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div id="top" className="app-shell">
      <Header />

      <main id="movies" className="movie-list-page">
        <section className="page-heading" aria-labelledby="movie-list-title">
          <div>
            <p className="eyebrow">UMCINE COLLECTION</p>
            <h1 id="movie-list-title">영화 목록</h1>
          </div>
          <p className="movie-count">총 {movies.length}편</p>
        </section>

        <MovieGrid movies={pageMovies} onToggleBookmark={handleToggleBookmark} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>

      <footer>
        <p>영화 정보 제공</p>
        <img src="/images/logos/tmdb-logo.svg" alt="TMDB" />
      </footer>
    </div>
  );
}
