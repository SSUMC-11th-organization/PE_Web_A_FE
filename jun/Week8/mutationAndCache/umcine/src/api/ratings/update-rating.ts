import { authApi } from "../auth-api";
import type { Rating, RatingApiResponse } from "./models";

export interface UpdateRatingRequest {
  ratingId: number;
  score: number;
  /** 보내지 않거나 null이면 후기가 지워져요. */
  comment: string | null;
}

export async function updateRating({
  ratingId,
  ...body
}: UpdateRatingRequest): Promise<Rating> {
  const response = await authApi
    .patch(`ratings/${ratingId}`, { json: body })
    .json<RatingApiResponse<Rating>>();
  return response.result;
}
