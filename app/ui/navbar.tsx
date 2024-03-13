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
            <ul className="nav-list">
                <li className="nav-item"><button className="button">Contact</button></li>
                <li className="nav-item">{session ? <User /> : <LoginButton />}</li>
                <li className="nav-item">{session ? <LogoutButton/> : <></>}</li>
            </ul>
        </nav>
    );
}