"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import '@/app/ui/navbar.css';

export const LoginButton = () => {
    const { data: session } = useSession()
    if (session) {
      return (
        <>
          Signed in as {session} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )
    }
    return (
        <button
            onClick={async () => {
                await signIn();
            }}
            className="button"
        >
            Login
        </button>
    )
}