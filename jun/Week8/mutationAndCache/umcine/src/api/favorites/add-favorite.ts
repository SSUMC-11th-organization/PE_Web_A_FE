import { authApi } from "../auth-api";
import type { ApiResponse, Favorite } from "./models";

export async function addFavorite(movieId: number): Promise<Favorite> {
  const response = await authApi
    .post("favorites", { json: { movieId } })
    .json<ApiResponse<Favorite>>();
  return response.result;
}
