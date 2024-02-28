import { authConfig } from '@/pages/api/auth/[...nextauth]'
import { LoginButton } from "@/src/auth/LoginButton";
import { getServerSession } from "next-auth"
import { User } from '@/src/auth/User'

export default async function Home() {
  const session = await getServerSession(authConfig);

  if(session) {
    return <User />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <LoginButton />
    </main>
  );
}
