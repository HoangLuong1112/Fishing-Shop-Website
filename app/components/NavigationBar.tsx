"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LinkButton from "./LinkButton";
import { useAuth } from "../provider/AuthProvider";
import Image from "next/image";
import SearchBar from "./SearchBar";
import UserNavigation from "./UserNavigation";

export default function NavigationBar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { user } = useAuth()

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
        <nav className={`fixed top-0 left-0 right-0 z-100 transition-all duration-300 border-b-2 border-black
            ${isScrolled ? "bg-green-300" : "bg-red-200"}`}
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
    );
}