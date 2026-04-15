"use client";
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle, 
    CardDescription 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail, User as UserIcon, Pencil } from "lucide-react";
import { useAuth } from "@/app/provider/AuthProvider";
import { useState } from "react";

export default function ProfilePage() {
    const { user } = useAuth();
    const { profile } = user;

    // update profile state
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState(profile.username);

    return (
        <div className="">
            <Card className="overflow-hidden rounded-none py-0 border-0">

                {/* Header với Background giả (Banner) */}
                <div className="h-32 bg-linear-to-r from-blue-400 to-indigo-500 w-full" />

                <div className="spacing border-0">
                    <CardHeader className="relative pb-0">

                        <div className="absolute -top-12 left-6">
                            <div className="flex gap-4 items-center">
                                <Avatar className="h-30 w-30 border-4 border-white shadow-lg">
                                    <AvatarImage src={profile.avatar_url} alt={profile.username} />
                                    <AvatarFallback className="bg-slate-200 text-2xl">
                                        {profile.username?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="pt-4">
                                    <CardTitle className="text-3xl font-bold">{profile.username}</CardTitle>
                                    <CardDescription className="text-lg">@{profile.username}</CardDescription>
                                </div>
                            </div>
                        </div>
                        
                    </CardHeader>

                    <CardContent className="mt-20">
                        <div className="space-y-6 ">

                            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                                Thông tin cá nhân
                            </h3>

                            {/* User information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                <div className="flex items-center gap-4 text-sm">
                                    {/* <div className="p-2 bg-slate-100 rounded-full">
                                        <UserIcon className="h-4 w-4 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">User name</p>
                                        <p className="text-muted-foreground">{profile.username}</p>
                                    </div> */}
                                    <div className="p-2 bg-slate-100 rounded-full">
                                        <UserIcon className="h-4 w-4 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">User name</p>
                                        <div className="text-muted-foreground flex gap-2 items-center">
                                            {isEditing ? (
                                                <input
                                                    value={newUsername}
                                                    onChange={(e) => setNewUsername(e.target.value)}
                                                    className="border px-2 py-1 rounded-md text-black"
                                                />
                                            ) : (
                                                <p>{profile.username}</p>                                                    
                                            )}
                                            <button
                                                onClick={() => setIsEditing(!isEditing)}
                                                className="p-1 hover:bg-slate-200 rounded-full"
                                            >
                                                <Pencil className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                    

                                    
                                </div>

                                <div className="flex items-center gap-4 text-sm">
                                    <div className="p-2 bg-slate-100 rounded-full">
                                        <UserIcon className="h-4 w-4 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Tình trạng tài khoản</p>
                                        <Badge variant={profile.is_active ? "default" : "destructive"}
                                            className={profile.is_active ? "bg-green-500 hover:bg-green-600" : ""}>
                                            {profile.is_active ? "Đang hoạt động" : "Bị khóa"}
                                        </Badge>
                                    </div>
                                </div>
                                
                        
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="p-2 bg-slate-100 rounded-full">
                                        <Mail className="h-4 w-4 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Email</p>
                                        <p className="text-muted-foreground">{profile.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm">
                                    <div className="p-2 bg-slate-100 rounded-full">
                                        <CalendarDays className="h-4 w-4 text-slate-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Ngày tham gia</p>
                                        <p className="text-muted-foreground">
                                            {profile.created_at 
                                            ? new Date(profile.created_at).toLocaleDateString("vi-VN") 
                                            : "Chưa rõ"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                                            
                        <div className="flex justify-end gap-3 my-8">
                            <button className="px-4 py-2 border rounded-md hover:bg-slate-50 transition-colors">
                                Lưu
                            </button>
                        </div>
                    </CardContent>
                </div>
                
            </Card>
        </div>
    );
}