import { createFileRoute } from "@tanstack/react-router";
import { MyPage } from "../../../../pages/me/my-page";

export const Route = createFileRoute("/(authenticated)/_authenticated/me/")({
  component: MyPage,
});
