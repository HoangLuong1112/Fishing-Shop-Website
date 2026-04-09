"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LinkButton from "./LinkButton";
import LogoutButton from "./LogoutButton";
import { useUser } from "../actions/useUser";

export default function NavigationBar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const {user, loading} = useUser()

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

    useEffect(() => {
        console.log("user updated:", user);
    }, [user]);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-100 transition-all duration-300 border-b-2 border-black
            ${isScrolled ? "bg-green-300" : "bg-white"}`}
        >
            <div className="container py-2">
                <div className="flex justify-between items-center">

                    <Link href="/" className="text-xl font-bold text-gray-800">
                        LOGO
                    </Link>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="/">Trang chủ</Link>
                            <Link href="/about">Giới thiệu</Link>
                            <Link href="/services">Dịch vụ</Link>
                            <Link href="/contact">Liên hệ</Link>
                        </div>
                    </div>

                    {!loading && (
                        user ? (
                            <div className="flex gap-3 bg-red-300">
                                <LinkButton text="Profile" href="/profile" />
                                <LogoutButton />
                            </div>
                        ) : (
                            <LinkButton text="Đăng nhập" href="/login" />
                        )
                    )}

                </div>
            </div>
        </nav>
    );
}