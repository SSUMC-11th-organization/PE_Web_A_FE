import type { Movie } from "../../types/movie";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
  // 넘기지 않으면 카드에 북마크 버튼을 보여주지 않아요.
  onToggleBookmark?: (movieId: number) => void;
  // true면 카드 아래에 원제와 줄거리를 함께 보여줘요.
  showDetails?: boolean;
}

export function MovieGrid({ movies, onToggleBookmark, showDetails }: MovieGridProps) {
  return (
    <ul className="grid grid-cols-1 gap-x-[18px] gap-y-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onToggleBookmark={onToggleBookmark}
          showDetails={showDetails}
        />
      ))}
    </ul>
  );
}
