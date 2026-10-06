import { useViewStore } from "../../stores/view-store";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";
import MovieCard from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
}

export default function MovieGrid({ movies }: MovieGridProps) {
  const cardSize = useViewStore((state) => state.cardSize);

  if (movies.length === 0) {
    return (
      <p className="py-20 text-center text-muted">표시할 영화가 없어요.</p>
    );
  }

  return (
    <ul
      className={cn(
        "grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2",
        cardSize === "large"
          ? "lg:grid-cols-2 xl:grid-cols-3"
          : "lg:grid-cols-3 xl:grid-cols-5",
      )}
    >
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieCard movie={movie} />
        </li>
      ))}
    </ul>
  );
}
