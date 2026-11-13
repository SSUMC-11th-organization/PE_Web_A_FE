import { createFileRoute } from "@tanstack/react-router";
import { MemberEditPage } from "../pages/members/member-edit-page";

export const Route = createFileRoute("/mypage/edit")({ component: MemberEditPage });
