import { useBookmarkStore } from "../../stores/bookmark-store";
import { cn } from "../../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  movieTitle: string;
  className?: string;
  showLabel?: boolean;
}

export function BookmarkButton({
  movieId,
  movieTitle,
  className,
  showLabel = false,
}: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) =>
    state.bookmarkedMovieIds.includes(movieId),
  );
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);

  return (
    <button
      type="button"
      className={cn(
        "flex items-center justify-center gap-2 transition",
        isBookmarked
          ? "bg-accent text-white hover:bg-accent-strong"
          : "bg-bg/65 text-text hover:bg-bg/90",
        className,
      )}
      aria-label={
        isBookmarked ? `${movieTitle} 북마크 해제` : `${movieTitle} 북마크 추가`
      }
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
    >
      <span
        className={cn(
          "size-[22px] shrink-0 bg-current",
          isBookmarked ? "icon-bookmark-filled" : "icon-bookmark",
        )}
        aria-hidden="true"
      />
      {showLabel ? (
        <span className="text-sm font-semibold">
          {isBookmarked ? "북마크 해제" : "북마크 추가"}
        </span>
      ) : null}
    </button>
  );
}
