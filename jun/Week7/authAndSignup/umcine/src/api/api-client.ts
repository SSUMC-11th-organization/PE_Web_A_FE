import ky from "ky";
import { env } from "../config/env";

// 회원 API 서버용 클라이언트 (TMDB 요청은 tmdb-client.ts를 사용해요)
export const apiClient = ky.create({ baseUrl: `${env.apiBaseUrl}/` });
