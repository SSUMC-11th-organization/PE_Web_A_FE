import { authApi } from "../auth-api";
import type { Rating, RatingApiResponse } from "./models";

export interface CreateRatingRequest {
  movieId: number;
  score: number;
  comment: string | null;
}

export async function createRating(body: CreateRatingRequest): Promise<Rating> {
  const response = await authApi
    .post("ratings", { json: body })
    .json<RatingApiResponse<Rating>>();
  return response.result;
}
