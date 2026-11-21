import { authApi } from "../auth-api";
import type { ApiResponse } from "./models";

export async function removeFavorite(movieId: number): Promise<void> {
  await authApi.delete(`favorites/${movieId}`).json<ApiResponse<null>>();
}
