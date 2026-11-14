import { apiClient } from "../api-client";
import type { Rating, RatingApiResponse } from "./models";

// 유저별 평점 조회는 누구나 볼 수 있는 공개 API라 apiClient로 요청해요.
export async function getMemberRatings(memberId: number): Promise<Rating[]> {
  const response = await apiClient
    .get(`members/${memberId}/ratings`)
    .json<RatingApiResponse<Rating[]>>();
  return response.result;
}
