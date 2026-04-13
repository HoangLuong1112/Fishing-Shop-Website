"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LinkButton from "./LinkButton";
import { useAuth } from "../provider/AuthProvider";
import Image from "next/image";
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
                <div className="flex justify-between items-center spacing">

                    <div className="">
                        <Link href="/" >
                            <Image src="https://upload.wikimedia.org/wikipedia/commons/7/78/Spotify_2.png" alt="Spotify Logo" width={32} height={32}/>
                        </Link>
                    </div>

                    <SearchBar />
                    

                    {/* <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="/">Trang chủ</Link>
                            <Link href="/about">Giới thiệu</Link>
                            <Link href="/services">Dịch vụ</Link>
                            <Link href="/contact">Liên hệ</Link>
                        </div>
                    </div> */}

                    {user ? (
                        <div className="flex items-center gap-4">
                            <UserNavigation user={user} />
                        </div>
                    ) : (
                        <LinkButton text="Đăng nhập" href="/login" />
                    )}

                </div>
            </div>
        </nav>
    </>
    );
}