import { createClient } from "@/utils/supabase/client";
import { UserProfile } from "../components/UserNavigation";

export async function getUsers() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("User")
        .select("*")
        .order("username", { ascending: true });

    if (error) {
        console.error("Error fetching users:", error);
        return [];
    }
    return data as UserProfile[];
}

export async function addUser(formData: Omit<UserProfile, "id" | "created_at">) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("User")
        .insert([{
            username: formData.username,
            email: formData.email,
            role: formData.role,
            avatar_url: formData.avatar_url,
        }])
        .select();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateUser(id: string, formData: Partial<UserProfile>) {
    const supabase = await createClient();
    const { id: _id, created_at, ...updateData } = formData;

    const { data, error } = await supabase
        .from("User")
        .update(updateData)
        .eq("id", id)
        .select();

    if (error) throw new Error(error.message);
    return data;
}

// Hàm Upload Ảnh chuyên dụng, trả về publicUrl, bắt buộc phải đi chung với updateUser
export async function uploadAvatar(userId: string, file: File, oldAvatarUrl?: string) {
    const supabase = await createClient();
    
    if (file.size > 2 * 1024 * 1024) throw new Error("Ảnh quá lớn (max 2MB)");
    if (!file.type.startsWith("image/")) throw new Error("Chỉ được upload ảnh");

    const fileExt = file.name.split(".").pop() || "png";
    const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from("main")
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
        .from("main")
        .getPublicUrl(filePath);

    // Xóa file cũ 
    if (oldAvatarUrl) {
        const oldPath = oldAvatarUrl.split("/storage/v1/object/public/main/")[1]?.split("?")[0];
        if (oldPath) {
            await supabase.storage.from("main").remove([oldPath]);
        }
    }

    return publicUrl;
}
