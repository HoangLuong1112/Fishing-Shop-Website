"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LinkButton from "./LinkButton";
import { useAuth } from "../provider/AuthProvider";
import SearchBar from "./SearchBar";
import UserNavigation from "./UserNavigation";
import { usePathname } from "next/navigation";

export default function NavigationBar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { user } = useAuth()

    let hide = false
    const pathname = usePathname()
    if (pathname.startsWith("/login") || 
        pathname.startsWith("/forgot-password") || 
        pathname.startsWith("/reset-password") || 
        pathname.startsWith("/signup")) {
        hide = true
    }

    useEffect(() => {
        // scroll
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            <div className={`mb-16 ${hide ? "hidden" : ""}`} />
            <nav className={`fixed h-16 top-0 left-0 right-0 z-50 transition-all duration-300 border-b-2
                ${isScrolled ? "bg-blue-950 text-white border-blue-950" : "bg-blue-300 text-black border-black"}
                ${hide ? "hidden" : ""}`}
            >
                <div className="w-full py-2">
                    <div className="grid grid-cols-4 items-center gap-5 spacing">

                        <div className="">
                            <Link href="/" >
                                {/* <Image src="https://upload.wikimedia.org/wikipedia/commons/7/78/Spotify_2.png" alt="Spotify Logo" width={32} height={32}/> */}
                                <p className={`text-3xl font-bold transition ${isScrolled ? "text-blue-200" : "text-blue-900"}`} style={{ fontFamily: "var(--font-playwrite)" }}>FishingShop</p>
                            </Link>
                        </div>

                        <div className="col-span-2">
                            <SearchBar />
                        </div>
                        
                        <div className="flex justify-end items-center gap-4 text-black">
                            {user ? (
                                <>
                                    {user.profile.role === "manager" || user.profile.role === "admin" && (
                                        <Link href={'/manager'} className="px-4 py-2 bg-neutral-50 hover:bg-neutral-200 border border-black rounded-full font-bold">
                                            Manager
                                        </Link>
                                    )}

                                    {user.profile.role === "admin" && (
                                        <Link href={'/admin'} className="px-4 py-2 bg-neutral-50 hover:bg-neutral-200 border border-black rounded-full font-bold">
                                            Admin
                                        </Link>
                                    )}
                                    
                                    <div className="flex items-center gap-4">
                                        <UserNavigation user={user} />
                                    </div>
                                </>
                                
                            ) : (
                                <LinkButton text="Đăng nhập" href="/login" />
                            )}
                        </div>

                    </div>
                </div>
            </nav>
        </>
    );
}