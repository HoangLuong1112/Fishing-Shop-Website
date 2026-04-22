"use client";

import { 
    ChevronDown, 
    User, 
    Settings, 
    LogOut, 
    CreditCard 
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
    Avatar, 
    AvatarFallback, 
    AvatarImage 
} from "@/components/ui/avatar";
import { useLogout } from "@/hooks/useLogout";
import Link from "next/link";
import { UserProfile } from "../utils/TypeGlobal";


interface UserNavigationProps {
    user: {
        profile : UserProfile;
    };
}

export default function UserNavigation({ user }: UserNavigationProps) {
    // console.log("UserNavigation rendered with user:", user);
    const { handleLogout } = useLogout()

    return (
        <DropdownMenu>
            {/* Nút kích hoạt dạng viên thuốc */}
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 pr-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-all shadow-sm focus:outline-none">
                {/* Bên trái: Avatar */}
                <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profile.avatar_url} alt={user?.profile.username} />
                    <AvatarFallback className="bg-blue-500 text-white text-xs">
                        {user?.profile.username?.charAt(0) || "U"}
                    </AvatarFallback>
                </Avatar>
                
                {/* Bên phải: Mũi tên chĩa xuống */}
                <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
            </DropdownMenuTrigger>

            {/* Menu xổ xuống */}
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.profile.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                    {user?.profile.email}
                    </p>
                </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <Link href={'/profile'}>
                    <DropdownMenuItem>
                        
                            <User className="mr-2 h-4 w-4" />
                            <span>Hồ sơ</span>
                        
                        
                    </DropdownMenuItem></Link>
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Cài đặt</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleLogout}
                    className="text-red-600 focus:bg-red-50 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}