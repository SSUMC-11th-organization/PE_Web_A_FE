import { authApi } from "./auth-api";
import type { ApiResponse } from "./models";
import { apiClient } from "./api-client";

export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RatingInput {
  score: number;
  comment?: string;
}

export function getMemberRatings(memberId: number) {
  return apiClient.get(`members/${memberId}/ratings`).json<Rating[]>();
}

export function createRating(movieId: number, input: RatingInput) {
  return authApi
    .post("ratings", { json: { movieId, ...input } })
    .json<ApiResponse<Rating>>();
}

export function updateRating(ratingId: number, input: RatingInput) {
  return authApi.patch(`ratings/${ratingId}`, { json: input }).json<ApiResponse<Rating>>();
}

export function removeRating(ratingId: number) {
  return authApi.delete(`ratings/${ratingId}`).json<ApiResponse<null>>();
}
