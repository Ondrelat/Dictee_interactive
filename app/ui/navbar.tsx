import React from "react";
import './navbar.css';
import { getServerSession } from "next-auth";
import { User } from '@/src/auth/User';
import { authConfig } from '@/pages/api/auth/[...nextauth]';
import { LoginButton } from "@/src/auth/LoginButton";
import { LogoutButton } from "@/src/auth/LogoutButton";

export default async function Navbar() {
    const session = await getServerSession(authConfig);

    return (
        <nav className="navbar">
            <div className="flex flex-row-reverse gap-4">
                <div>{session ? <User /> : <LoginButton />}</div>
                <div>{session ? <LogoutButton/> : <></>}</div>
                <div><button className="button">Contact</button></div>
            </div>
        </nav>
    );
}