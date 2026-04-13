"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    Users, 
    Settings, 
    ChevronLeft, 
    Menu, 
    Bell,
    LucideIcon 
} from "lucide-react";

export interface SidebarItem {
    title: string;
    href: string;
    icon?: LucideIcon; // Dùng kiểu này để truyền Component Icon vào trực tiếp
}

interface SidebarProps {
    data?: SidebarItem[];
}

const defaultMenuItems: SidebarItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Users", href: "/users", icon: Users },
    { title: "Notifications", href: "/notifications", icon: Bell },
    { title: "Settings", href: "/settings", icon: Settings },
    { title: "No Icon Item", href: "/no-icon" },
];

export default function Sidebar({ data = defaultMenuItems }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <aside className={`relative flex flex-col bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out min-h-screen border-r border-slate-800 
            ${isCollapsed ? "w-20" : "w-64"}`}>
            
            {/* Header */}
            <div className="flex items-center justify-between p-4 h-16 border-b border-slate-800">
                {!isCollapsed && (
                    <span className="font-bold text-xl text-white truncate animate-in fade-in duration-500">
                        Admin Panel
                    </span>
                )}
                <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-lg hover:bg-slate-800 transition-colors ml-auto text-slate-400 hover:text-white">
                    {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                </button> 
            </div>
            {/* 7911229393 */}
            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-2">
                {data.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                        <Link key={item.title} href={item.href} className={`flex items-center gap-3 p-3 rounded-xl transition-all group 
                        ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "hover:bg-slate-800 hover:text-white"}`}>
                            <div className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}>
                                {Icon ? <Icon size={20} /> : <LayoutDashboard size={20} />}
                            </div>
                            
                            {!isCollapsed && (
                                <span className="font-medium whitespace-nowrap overflow-hidden animate-in slide-in-from-left-1 duration-300">
                                    {item.title}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}