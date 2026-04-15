"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail, User as UserIcon, Pencil } from "lucide-react";
import { useAuth } from "@/app/provider/AuthProvider";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client"; // nhớ import client
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user } = useAuth();
    const { profile } = user;
    const router = useRouter()

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [newUsername, setNewUsername] = useState(profile.username);
    const [newAvatar, setNewAvatar] = useState<File | null>(null);
    const [previewAvatar, setPreviewAvatar] = useState(profile.avatar_url);

    // upload avatar
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewAvatar(file);
            setPreviewAvatar(URL.createObjectURL(file));
        }
    };

    // save profile
    const handleSave = async () => {
        try {
            setLoading(true);

            let avatarUrl = profile.avatar_url;

            const supabase = createClient();

            if (newAvatar) {
                const fileExt = newAvatar.name.split(".").pop() || "png";
                const fileName = `avatars/${profile.id}-${Date.now()}.${fileExt}`;
                const filePath = fileName;

                if (newAvatar.size > 2 * 1024 * 1024) {
                    alert("Ảnh quá lớn (max 2MB)");
                    return;
                }

                if (!newAvatar.type.startsWith("image/")) {
                    alert("Chỉ được upload ảnh");
                    return;
                }

                // upload avatar mới trước
                const { error: uploadError } = await supabase.storage
                    .from("main") //bucket tên là main
                    .upload(filePath, newAvatar);

                if (uploadError) throw uploadError;

                // lấy public url
                const { data } = supabase.storage
                    .from("main")
                    .getPublicUrl(filePath);

                const newAvatarUrl = data.publicUrl;

                // chỉ khi upload OK → mới xóa file cũ
                if (profile.avatar_url) {
                    const oldPath = profile.avatar_url
                        ?.split("/storage/v1/object/public/main/")[1]
                        ?.split("?")[0];
                    
                    console.log("OLD URL:", profile.avatar_url);
                    console.log("OLD PATH:", oldPath);

                    if (oldPath) {
                        const { data: deleteData, error: deleteError } = await supabase.storage.from("main").remove([oldPath]);

                        console.log("DELETE DATA:", deleteData);
                        console.log("DELETE ERROR:", deleteError);
                    }
                }

                // update lại url mới
                avatarUrl = newAvatarUrl;
            }

            console.log("Updating profile with username:", newUsername);

            // update DB
            const { error } = await supabase
                .from("User")
                .update({
                    username: newUsername,
                    avatar_url: avatarUrl,
                })
                .eq("id", profile.id);

            if (error) throw error;

            alert("Cập nhật thành công!");
            setIsEditing(false);
            router.refresh();
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Card className="overflow-hidden rounded-none py-0 border-0">
                <div className="h-32 bg-linear-to-r from-blue-400 to-indigo-500 w-full" />

                <div>
                    <CardHeader className="relative pb-0">
                        <div className="absolute -top-12 left-6">
                            <div className="flex gap-4 items-center">
                                <div className="relative group">
                                    <Avatar className="h-30 w-30 border-4 border-white shadow-lg">
                                        <AvatarImage src={previewAvatar} />
                                        <AvatarFallback>
                                            {profile.username?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Overlay khi hover */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-full">
                                        <button
                                            onClick={() => {
                                                setIsEditing(true);
                                                document.getElementById("avatarInput")?.click();
                                            }}
                                            className="bg-white p-2 rounded-full shadow hover:scale-105 transition"
                                        >
                                            <Pencil className="w-4 h-4 text-black" />
                                        </button>
                                    </div>

                                    {/* Hidden input */}
                                    <input
                                        id="avatarInput"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                </div>

                                <div className="pt-4">
                                    <CardTitle className="text-3xl font-bold">
                                        {newUsername}
                                    </CardTitle>
                                    <CardDescription>
                                        @{newUsername}
                                    </CardDescription>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="mt-20">
                        <div className="space-y-6">
                            <h3 className="text-sm font-semibold text-muted-foreground uppercase">
                                Thông tin cá nhân
                            </h3>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* USERNAME */}
                                <div className="flex items-center gap-4 text-sm">
                                    <UserIcon className="h-4 w-4" />
                                    <div>
                                        <p className="font-medium">User name</p>

                                        <div className="flex gap-2 items-center">
                                            {isEditing ? (
                                                <input
                                                    value={newUsername}
                                                    onChange={(e) =>
                                                        setNewUsername(e.target.value)
                                                    }
                                                    className="border px-2 py-1 rounded-md"
                                                />
                                            ) : (
                                                <p>{profile.username}</p>
                                            )}

                                            <button
                                                onClick={() => setIsEditing(!isEditing)}
                                            >
                                                <Pencil className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* STATUS */}
                                <div className="flex items-center gap-4 text-sm">
                                    <UserIcon className="h-4 w-4" />
                                    <div>
                                        <p className="font-medium">
                                            Tình trạng tài khoản
                                        </p>
                                        <Badge
                                            variant={
                                                profile.is_active
                                                    ? "default"
                                                    : "destructive"
                                            }
                                        >
                                            {profile.is_active
                                                ? "Đang hoạt động"
                                                : "Bị khóa"}
                                        </Badge>
                                    </div>
                                </div>

                                {/* EMAIL */}
                                <div className="flex items-center gap-4 text-sm">
                                    <Mail className="h-4 w-4" />
                                    <div>
                                        <p className="font-medium">Email</p>
                                        <p>{profile.email}</p>
                                    </div>
                                </div>

                                {/* DATE */}
                                <div className="flex items-center gap-4 text-sm">
                                    <CalendarDays className="h-4 w-4" />
                                    <div>
                                        <p className="font-medium">Ngày tham gia</p>
                                        <p>
                                            {profile.created_at
                                                ? new Date(
                                                      profile.created_at
                                                  ).toLocaleDateString("vi-VN")
                                                : "Chưa rõ"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex justify-end gap-3 my-8">
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                >
                                    {loading ? "Đang lưu..." : "Lưu"}
                                </button>
                            </div>
                        )}
                    </CardContent>
                </div>
            </Card>
        </div>
    );
}