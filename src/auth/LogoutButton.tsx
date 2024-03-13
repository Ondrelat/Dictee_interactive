"use client"
import { signOut } from "next-auth/react"
import '@/app/ui/navbar.css';

export const LogoutButton = () => {
    return (
        <button
            onClick={async () => {
                await signOut();
            }}
            className="button"
        >
            Logout
        </button>
    )
}