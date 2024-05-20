// navbar.tsx
import React from "react";
import { getServerSession } from "next-auth";
import { User } from '@/src/auth/User';
import { authConfig } from '@/pages/api/auth/[...nextauth]';
import { LoginButton } from "@/src/auth/LoginButton";
import { LogoutButton } from "@/src/auth/LogoutButton";
import Link from 'next/link';
import Image from 'next/image';

export default async function Navbar() {
    const session = await getServerSession(authConfig);

    return (
        <nav className="bg-gray-50 text-gray-800 py-6 shadow-md">
            <div className="flex flex-row items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-6">
                    <Image src="/favicon.ico" width={50} height={50} alt="Icone de stylo" className="rounded-full" />
                    <h1 className="font-kalam text-4xl leading-tight">Dictée interactive</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <Link href="/contact">
                        <button className="bg-white text-gray-700 font-bold py-3 px-5 rounded-lg shadow-md hover:bg-gray-100 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition duration-200">
                            Contact
                        </button>
                    </Link>
                    {session ? <LogoutButton /> : <></>}
                    {session ? <User /> : <LoginButton />}
                </div>
            </div>
        </nav>
    );
}