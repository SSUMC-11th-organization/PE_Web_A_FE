import { useBookmarkStore } from "../stores/bookmark-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  title: string;
  className?: string;
  showLabel?: boolean;
}

export function BookmarkButton({ movieId, title, className, showLabel = false }: BookmarkButtonProps) {
  const isBookmarked = useBookmarkStore((state) => state.bookmarkedMovieIds.includes(movieId));
  const toggleBookmark = useBookmarkStore((state) => state.toggleBookmark);
  const bookmarkIcon = isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg";

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-black/55 font-bold backdrop-blur transition hover:scale-105",
        isBookmarked && "bg-umc",
        className,
      )}
      type="button"
      aria-label={`${title} 북마크 ${isBookmarked ? "해제" : "추가"}`}
      aria-pressed={isBookmarked}
      onClick={() => toggleBookmark(movieId)}
    >
      <img className="size-5" src={bookmarkIcon} alt="" />
      {showLabel && <span>{isBookmarked ? "북마크 해제" : "북마크 추가"}</span>}
    </button>
  );
}
