import { useQuery } from "@tanstack/react-query";
import {
  favoriteStatusQueryOptions,
  favoritesQueryOptions,
} from "../queries/favorite-queries";
import { useAuthStore } from "../stores/auth-store";

/** 내 즐겨찾기 목록. 로그인했을 때만 조회해요. */
export function useFavoritesQuery() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    ...favoritesQueryOptions,
    enabled: Boolean(accessToken),
  });
}

/**
 * 영화 카드처럼 여러 영화를 한 화면에 보여줄 때 쓰는 즐겨찾기 여부예요.
 * 카드마다 요청하지 않고 목록 캐시 하나를 함께 읽어요.
 */
export function useIsFavoriteInList(movieId: number) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { data: isFavorite = false } = useQuery({
    ...favoritesQueryOptions,
    enabled: Boolean(accessToken),
    select: (favorites) => favorites.some((favorite) => favorite.movieId === movieId),
  });

  // 로그아웃 뒤 남아 있는 캐시는 보여주지 않아요.
  return Boolean(accessToken) && isFavorite;
}

/** 영화 상세에서 쓰는 즐겨찾기 여부 (GET /favorites/{movieId}) */
export function useFavoriteStatusQuery(movieId: number) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const query = useQuery({
    ...favoriteStatusQueryOptions(movieId),
    enabled: Boolean(accessToken),
  });

  return {
    isFavorite: Boolean(accessToken) && (query.data?.isFavorite ?? false),
    // 로그인했고 첫 조회 중일 때만 로딩으로 봐요.
    isLoading: query.isLoading,
  };
}
