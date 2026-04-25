import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const cookieStore = await cookies();
  const loggedIn = Boolean(cookieStore.get("refreshToken")?.value);

  redirect(loggedIn ? "/feed" : "/login");
}
