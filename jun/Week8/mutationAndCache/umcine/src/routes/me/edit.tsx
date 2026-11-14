import { createFileRoute } from "@tanstack/react-router";
import { MyEditPage } from "../../pages/me/my-edit-page";

export const Route = createFileRoute("/me/edit")({
  component: MyEditPage,
});
