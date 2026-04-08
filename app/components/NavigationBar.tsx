"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LinkButton from "./LinkButton";
import { createClient } from "@/utils/supabase/client";

export default function NavigationBar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const supabase = createClient()

        // scroll
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);

        // get user
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            setUser(data.user);
        };

        getUser();

        // listen login/logout
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_, session) => {
                setUser(session?.user ?? null);
            }
        );

        return () => {
            window.removeEventListener("scroll", handleScroll);
            listener.subscription.unsubscribe();
        };
    }, []);

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

                    {user ? (
                        <LinkButton text="Profile" href="/profile" />
                    ) : (
                        <LinkButton text="Đăng nhập" href="/login" />
                    )}
                </div>
            </div>
        </nav>
    );
}