import { createFileRoute } from "@tanstack/react-router";
import { MyEditPage } from "../../../../pages/me/my-edit-page";

export const Route = createFileRoute("/(authenticated)/_authenticated/me/edit")({
  component: MyEditPage,
});
