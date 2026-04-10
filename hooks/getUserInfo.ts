import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

// đây là cái hook tổng lấy user info từ session, đồng thời fetch thêm profile info từ bảng User
export function getUserInfo() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    // Hàm này là "trạm kiểm soát" duy nhất để cập nhật State
    const updateFullUser = async (supabaseUser: any) => {
		if (!supabaseUser) {
			setUser(null);
			return;
		}

		// Fetch thêm data từ bảng User (Database)
		const { data: profile, error } = await supabase
			.from("User")
			.select("*")
			.eq("id", supabaseUser.id)
			.single();

		if (error) {
			console.error("❌ Profile Error:", error);
			// Nếu lỗi profile, vẫn giữ lại data auth cơ bản để user không bị log out vô lý
			setUser(supabaseUser); 
		} else {
			// ✅ KẾT HỢP Ở ĐÂY: Gộp thông tin Auth và Profile
			setUser({ ...supabaseUser, profile });
		}
    };

    useEffect(() => {
		const initialize = async () => {
			setLoading(true);
			const { data: { user: authUser } } = await supabase.auth.getUser();
			await updateFullUser(authUser);
			setLoading(false);
		};

		initialize();

		const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
			// Chỉ fetch lại profile khi cần thiết (đăng nhập, đổi token)
			if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
			await updateFullUser(session?.user);
			} else if (event === 'SIGNED_OUT') {
			setUser(null);
			}
		});

		return () => authListener.subscription.unsubscribe();
    }, []);

    return { user, loading };
}