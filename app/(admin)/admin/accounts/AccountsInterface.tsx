"use client";

import React, { useState, useMemo, useRef } from "react";
import { Search, Save, RotateCcw, Shield, Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { addUser, updateUser, uploadAvatar } from "@/app/actions/accountAction";

export default function AccountsInterface({ initialData }: any) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [users] = useState(initialData);
    const [loading, setLoading] = useState(false);
    
    const emptyForm = { 
        id: "", 
        username: "", 
        email: "", 
        role: "client", 
        is_active: true,
        avatar_url: ""
    };

    const [form, setForm] = useState(emptyForm);
    const [searchTerm, setSearchTerm] = useState("");
    const [newImage, setNewImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState("");

    // Xử lý khi chọn ảnh từ máy tính
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) return toast.error("Ảnh không được quá 2MB");
            setNewImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            let avatarUrl = form.avatar_url;

            if (form.id) {
                if (newImage) {
                    avatarUrl = await uploadAvatar(form.id, newImage, form.avatar_url);
                }

                await updateUser(form.id, {
                    username: form.username,
                    email: form.email,
                    role: form.role,
                    is_active: form.is_active,
                    avatar_url: avatarUrl
                });

                toast.success("Cập nhật tài khoản thành công");

            } else {
                // 1. Tạo user trước (chưa cần avatar)
                const created = await addUser({
                    username: form.username,
                    email: form.email,
                    role: form.role,
                    is_active: form.is_active,
                    avatar_url: ""
                });

                const newUser = created?.[0];
                if (!newUser) throw new Error("Không tạo được user");

                // 2. Upload avatar giống hệt ProfilePage
                if (newImage) {
                    avatarUrl = await uploadAvatar(newUser.id, newImage);
                    
                    // 3. Update lại giống ProfilePage
                    await updateUser(newUser.id, {
                        avatar_url: avatarUrl
                    });
                }

                toast.success("Tạo tài khoản mới thành công");
            }

            handleReset();
            router.refresh();

        } catch (err: any) {
            toast.error(err.message || "Có lỗi xảy ra khi lưu dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setForm(emptyForm);
        setNewImage(null);
        setPreviewImage("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const filteredData = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();
        return users.filter((u: any) => 
            u.username?.toLowerCase().includes(keyword) || 
            u.email?.toLowerCase().includes(keyword)
        ).sort((a: any, b: any) => b.username.localeCompare(a.username));
    }, [users, searchTerm]);

    const currentItems = filteredData;

    return (
        <div className="space-y-6">
            {/* Form Section */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="bg-slate-900 p-4 text-white text-xs font-bold uppercase tracking-widest flex justify-between items-center">
                    <span>{form.id ? `Chỉnh sửa: ${form.username}` : "Tạo tài khoản mới"}</span>
                    {form.id && (
                        <button onClick={handleReset} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition text-[10px]">Hủy</button>
                    )}
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Cột chọn ảnh */}
                        <div className="flex flex-col items-center gap-2">
                            <div className="relative group">
                                <div className="w-28 h-28 rounded-full border-4 border-slate-50 shadow-inner overflow-hidden bg-slate-100 flex items-center justify-center">
                                    {(previewImage || form.avatar_url) ? (
                                        <img src={previewImage || form.avatar_url} className="w-full h-full object-cover" alt="Preview" />
                                    ) : (
                                        <span className="text-slate-300 font-bold text-2xl uppercase">{form.username?.charAt(0) || "U"}</span>
                                    )}
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full border-2 border-white hover:bg-blue-700 transition shadow-md"
                                >
                                    <Camera size={16} />
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Ảnh đại diện</span>
                        </div>

                        {/* Cột input thông tin */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Tên đăng nhập</label>
                                <input 
                                    type="text"
                                    value={form.username} 
                                    onChange={e => setForm({...form, username: e.target.value})} 
                                    className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 transition" 
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Email</label>
                                <input 
                                    type="email"
                                    value={form.email} 
                                    onChange={e => setForm({...form, email: e.target.value})} 
                                    className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 transition" 
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Vai trò</label>
                                <select 
                                    value={form.role} 
                                    onChange={e => setForm({...form, role: e.target.value})} 
                                    className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 transition"
                                >
                                    <option value="client">Client</option>
                                    <option value="employee">Employee</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="md:col-span-2 flex items-center gap-6 mt-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input 
                                        type="checkbox" 
                                        checked={form.is_active}
                                        onChange={e => setForm({...form, is_active: e.target.checked})}
                                        className="w-4 h-4 accent-blue-600 cursor-pointer"
                                    />
                                    <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600 uppercase transition">Kích hoạt tài khoản</span>
                                </label>
                            </div>

                            <div className="flex gap-2 items-end">
                                <button 
                                    {...form.id ? { disabled: false } : { disabled: !loading }}
                                    type="submit" 
                                    // disabled={loading}
                                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-slate-400 transition shadow-lg shadow-blue-100"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18}/>}
                                    {form.id ? "Cập nhật" : "Lưu ngay"}
                                </button>
                                <button type="button" onClick={handleReset} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition border">
                                    <RotateCcw size={18}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* List Section */}
            <div className="space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm theo tên đăng nhập hoặc email..." 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)} 
                        className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" 
                    />
                </div>

                <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b text-[11px] font-black uppercase text-slate-500">
                            <tr>
                                <th className="p-4">Người dùng</th>
                                <th className="p-4">Thông tin liên lạc</th>
                                <th className="p-4 text-center">Vai trò</th>
                                <th className="p-4 text-center">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item: any) => (
                                <tr 
                                    key={item.id} 
                                    onClick={() => {
                                        setForm({
                                            id: item.id,
                                            username: item.username || "",
                                            email: item.email || "",
                                            role: item.role || "user",
                                            is_active: item.is_active,
                                            avatar_url: item.avatar_url || ""
                                        });
                                        setPreviewImage(""); // Reset preview khi chuyển dòng
                                        setNewImage(null);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }} 
                                    className={`border-b transition cursor-pointer group ${form.id === item.id ? "bg-blue-50" : "hover:bg-slate-50"}`}
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm bg-slate-200 overflow-hidden shrink-0 transition group-hover:scale-105">
                                                {item.avatar_url ? (
                                                    <img src={item.avatar_url} alt="avt" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs font-black text-slate-400">
                                                        {item.username?.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="font-bold text-slate-900">{item.username}</div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600 font-medium">{item.email}</td>
                                    <td className="p-4 text-center">
                                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                                            <Shield size={12}/> {item.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase border ${item.is_active ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                                            {item.is_active ? "Online" : "Locked"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}