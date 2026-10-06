import { MovieGrid } from "../../components/movies/movie-grid";
import { Pagination } from "../../components/movies/pagination";
import { movies as initialMovies } from "../../data/movies";
import { useBookmarkStore } from "../../stores/bookmark-store";

export function MovieListPage() {
  const bookmarkedMovieIds = useBookmarkStore((state) => state.bookmarkedMovieIds);
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  const movies = initialMovies.map((movie) => ({
    ...movie,
    isBookmarked: bookmarkedMovieIds.includes(movie.id),
  }));

  return (
    <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 pt-7 pb-12 xl:px-0">
      <h1 className="mb-5 text-[36px] font-extrabold tracking-[-0.72px]">영화 목록</h1>
      <MovieGrid movies={movies} onToggleBookmark={toggleBookmark} />
      <Pagination currentPage={1} totalPages={1} />
    </main>
  );
}
