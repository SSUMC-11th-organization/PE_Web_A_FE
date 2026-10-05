import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movie.id),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const bookmarkIcon = isBookmarked
    ? "/icons/bookmark.svg"
    : "/icons/bookmark-outline.svg";

  return (
    <li className="group relative">
      <Link
        to="/movies/$movieId"
        params={{ movieId: String(movie.id) }}
        className="flex flex-col gap-3"
      >
        <div className="aspect-2/3 overflow-hidden rounded-[10px] bg-surface-hover">
          <img
            src={movie.posterPath}
            alt={movie.title}
            className="size-full object-cover transition-transform duration-250 ease-in-out group-hover:scale-104"
          />
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="truncate text-sm font-bold text-text">{movie.title}</h3>
          <p className="text-[13px] text-muted">{movie.releaseDate}</p>
        </div>
      </Link>

      <button
        type="button"
        className={cn(
          "absolute top-2 right-2 flex size-[30px] items-center justify-center rounded-[7px] backdrop-blur-[2px] transition-[background-color,transform] duration-150 ease-in-out hover:scale-106",
          isBookmarked ? "bg-accent" : "bg-text/55",
        )}
        aria-pressed={isBookmarked}
        aria-label={isBookmarked ? "북마크 해제" : "북마크 추가"}
        onClick={() => toggleBookmark(movie.id)}
      >
        <img src={bookmarkIcon} alt="" className="size-[15px] invert" />
      </button>
    </li>
  );
}
