import { redirect } from "next/navigation";

/** Mobile-number login is the only way in; there is no sign-up or password flow. */
export default function Page() {
  redirect("/login");
}
