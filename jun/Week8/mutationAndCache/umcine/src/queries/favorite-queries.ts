import { queryOptions } from "@tanstack/react-query";
import { getFavoriteStatus } from "../api/favorites/get-favorite-status";
import { getFavorites } from "../api/favorites/get-favorites";

// ["favorites"]로 무효화하면 목록과 영화별 상태를 한 번에 갱신할 수 있어요.
export const favoriteKeys = {
  all: ["favorites"] as const,
  list: () => [...favoriteKeys.all, "list"] as const,
  status: (movieId: number) => [...favoriteKeys.all, "status", movieId] as const,
};

// 마이페이지와 영화 카드가 함께 쓰는 내 즐겨찾기 목록이에요.
export const favoritesQueryOptions = queryOptions({
  queryKey: favoriteKeys.list(),
  queryFn: getFavorites,
  retry: false,
});

// 영화 상세에서 이 영화를 즐겨찾기했는지 확인해요.
export function favoriteStatusQueryOptions(movieId: number) {
  return queryOptions({
    queryKey: favoriteKeys.status(movieId),
    queryFn: () => getFavoriteStatus(movieId),
    retry: false,
  });
}
