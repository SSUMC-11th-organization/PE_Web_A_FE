import { Link } from "@tanstack/react-router";
import type { Movie } from "../../types/movie";
import { cn } from "../../utils/cn";

interface MovieCardProps {
  movie: Movie;
  onToggleBookmark?: (movieId: number) => void;
  showDetails?: boolean;
}

export function MovieCard({ movie, onToggleBookmark, showDetails = false }: MovieCardProps) {
  const { id, title, originalTitle, releaseDate, overview, posterPath, isBookmarked } = movie;

  return (
    <li>
      <div className="relative aspect-[242/274] overflow-hidden rounded-lg bg-line">
        <Link
          className="group block size-full"
          to="/movies/$movieId"
          params={{ movieId: String(id) }}
          aria-label={`${title} 상세 보기`}
        >
          <img
            className="size-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
            src={posterPath}
            alt=""
          />
        </Link>
        {onToggleBookmark && (
          <button
            className={cn(
              "absolute top-2.5 right-2.5 flex size-[34px] items-center justify-center rounded-md border-[1.5px]",
              isBookmarked ? "border-primary bg-primary" : "border-white/90 bg-ink/75",
            )}
            type="button"
            aria-label={isBookmarked ? `${title} 북마크 해제` : `${title} 북마크`}
            aria-pressed={isBookmarked}
            onClick={() => onToggleBookmark(id)}
          >
            <img
              className="size-[22px] invert"
              src={isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg"}
              alt=""
            />
          </button>
        )}
      </div>
      <h3 className="mt-2.5 text-sm leading-5 font-bold">
        <Link to="/movies/$movieId" params={{ movieId: String(id) }}>
          {title}
        </Link>
      </h3>
      {showDetails && <p className="text-xs leading-[18px] text-ink-sub">{originalTitle}</p>}
      <p className="mt-0.5 text-xs leading-[18px] text-ink-muted">{releaseDate}</p>
      {showDetails && (
        <p className="mt-1.5 line-clamp-3 text-xs leading-[18px] text-ink-sub">{overview}</p>
      )}
    </li>
  );
}
