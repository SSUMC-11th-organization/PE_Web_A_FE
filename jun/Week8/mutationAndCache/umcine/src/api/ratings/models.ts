export interface Rating {
  ratingId: number;
  /** TMDB 영화 ID */
  movieId: number;
  /** 1~5 정수 */
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RatingApiResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}
