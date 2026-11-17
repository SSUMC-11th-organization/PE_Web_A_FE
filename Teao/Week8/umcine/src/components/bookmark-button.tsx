import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFavorite, getFavoriteStatus, removeFavorite } from "../api/favorites";
import { useAuthStore } from "../stores/auth-store";
import { cn } from "../utils/cn";

interface BookmarkButtonProps {
  movieId: number;
  title: string;
  className?: string;
  showLabel?: boolean;
}

export function BookmarkButton({ movieId, title, className, showLabel = false }: BookmarkButtonProps) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();
  const favoriteQuery = useQuery({
    queryKey: ["favorites", movieId],
    queryFn: () => getFavoriteStatus(movieId),
    enabled: Boolean(accessToken),
    retry: false,
  });
  const favoriteMutation = useMutation({
    mutationFn: async (isFavorite: boolean) => {
      if (isFavorite) await removeFavorite(movieId);
      else await createFavorite(movieId);
    },
    onSuccess: (_, wasFavorite) => {
      queryClient.setQueryData(["favorites", movieId], !wasFavorite);
      queryClient.invalidateQueries({ queryKey: ["favorites", "list"] });
    },
    onError: () => alert("즐겨찾기 변경에 실패했어요."),
  });
  const isBookmarked = favoriteQuery.data ?? false;
  const bookmarkIcon = isBookmarked ? "/icons/bookmark.svg" : "/icons/bookmark-outline.svg";

  const handleClick = () => {
    if (!accessToken) {
      alert("로그인 후 즐겨찾기를 사용할 수 있어요.");
      return;
    }
    if (!favoriteMutation.isPending) favoriteMutation.mutate(isBookmarked);
  };

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
      disabled={favoriteMutation.isPending}
      onClick={handleClick}
    >
      <img className="size-5" src={bookmarkIcon} alt="" />
      {showLabel && <span>{isBookmarked ? "북마크 해제" : "북마크 추가"}</span>}
    </button>
  );
}
