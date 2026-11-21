import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { addFavorite } from "../api/favorites/add-favorite";
import type { Favorite, FavoriteStatus } from "../api/favorites/models";
import { removeFavorite } from "../api/favorites/remove-favorite";
import { getApiErrorMessage } from "../api/get-api-error-message";
import { favoriteKeys } from "../queries/favorite-queries";
import { useAuthStore } from "../stores/auth-store";

interface ToggleFavoriteVariables {
  movieId: number;
  /** 요청을 보내기 전의 즐겨찾기 여부 */
  isFavorite: boolean;
}

/**
 * 즐겨찾기를 추가하거나 해제해요.
 * 성공하면 응답과 요청 값으로 목록·상태 캐시를 직접 바꿔서 다시 조회하지 않아요.
 */
export function useToggleFavoriteMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);

  const mutation = useMutation({
    mutationFn: async ({ movieId, isFavorite }: ToggleFavoriteVariables) => {
      if (isFavorite) {
        await removeFavorite(movieId);
        return null;
      }
      return addFavorite(movieId);
    },
    onSuccess: (addedFavorite, { movieId, isFavorite }) => {
      // 영화 상세의 상태 캐시: 요청에 보낸 값만으로 결과를 알 수 있어요.
      queryClient.setQueryData<FavoriteStatus>(favoriteKeys.status(movieId), {
        movieId,
        isFavorite: !isFavorite,
      });

      // 마이페이지·카드의 목록 캐시: 아직 조회한 적이 없다면 그대로 두고 나중에 조회해요.
      queryClient.setQueryData<Favorite[]>(favoriteKeys.list(), (prev) => {
        if (!prev) return prev;
        const others = prev.filter((favorite) => favorite.movieId !== movieId);
        // 목록은 최신순이므로 새로 추가한 영화를 맨 앞에 둬요.
        return addedFavorite ? [addedFavorite, ...others] : others;
      });
    },
    onError: (error) => {
      alert(getApiErrorMessage(error, "즐겨찾기를 변경하지 못했어요. 다시 시도해 주세요."));
      // 이미 추가·해제된 상태였을 수 있으므로 서버 값으로 다시 맞춰요.
      queryClient.invalidateQueries({ queryKey: favoriteKeys.all });
    },
  });

  const toggleFavorite = (movieId: number, isFavorite: boolean) => {
    if (!accessToken) {
      alert("로그인하면 즐겨찾기를 사용할 수 있어요.");
      navigate({ to: "/login" });
      return;
    }
    if (mutation.isPending) return;

    mutation.mutate({ movieId, isFavorite });
  };

  return { toggleFavorite, isPending: mutation.isPending };
}
