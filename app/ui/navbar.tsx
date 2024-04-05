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
            <div className="flex flex-row items-center gap-4 w-3/5 mx-auto">
                <div><h1 className="title text-2xl">Dictée interactive</h1></div>
                <div className="ml-auto"><button className="button">Contact</button></div>
                <div>{session ? <LogoutButton/> : <></>}</div>
                <div>{session ? <User /> : <LoginButton />}</div>
            </div>
        </nav>
    );
}