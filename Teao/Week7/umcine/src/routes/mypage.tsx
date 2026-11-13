import { createFileRoute } from "@tanstack/react-router";
import { MypageRoutePage } from "../pages/members/mypage-route-page";

export const Route = createFileRoute("/mypage")({ component: MypageRoutePage });
