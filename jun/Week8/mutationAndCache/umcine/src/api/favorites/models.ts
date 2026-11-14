// 즐겨찾기 API는 아직 서버 명세(API_SPEC.md)에 없어서,
// 평점 API와 같은 공통 응답 형식({ isSuccess, code, message, result })을 가정했어요.
//
// GET    /favorites            → result: Favorite[] (최신순)
// GET    /favorites/{movieId}  → result: FavoriteStatus
// POST   /favorites            → body: { movieId }, result: Favorite (201)
// DELETE /favorites/{movieId}  → result: null
//
// 모두 로그인이 필요해서 authApi로 요청해요.

export interface Favorite {
  favoriteId: number;
  movieId: number;
  createdAt: string;
}

export interface FavoriteStatus {
  movieId: number;
  isFavorite: boolean;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}
