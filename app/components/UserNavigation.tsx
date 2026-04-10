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
import { startTransition } from "react";
import { logout } from "../actions/logout";

interface UserNavigationProps {
    user: {
        name?: string;
        email?: string;
        image?: string;
    };
}

export default function UserNavigation({ user }: UserNavigationProps) {
    return (
        <DropdownMenu>
            {/* Nút kích hoạt dạng viên thuốc */}
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 pr-3 rounded-full border border-gray-200 hover:bg-gray-50 transition-all shadow-sm focus:outline-none">
                {/* Bên trái: Avatar */}
                <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.image} alt={user?.name} />
                    <AvatarFallback className="bg-blue-500 text-white text-xs">
                    {user?.name?.charAt(0) || "U"}
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
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                    </p>
                </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Hồ sơ</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Gói đăng ký</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Cài đặt</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />
                
                <DropdownMenuItem
                    onClick={() => {
                        startTransition(() => {
                            logout()
                        })
                    }}
                    className="text-red-600 focus:bg-red-50 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Đăng xuất</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}