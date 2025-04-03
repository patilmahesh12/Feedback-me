import { cookies } from "next/headers";
import HeroPage from "@/components/heropage";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  return <HeroPage token={token} />;
}
