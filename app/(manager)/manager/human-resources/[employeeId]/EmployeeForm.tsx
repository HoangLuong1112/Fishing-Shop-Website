"use client";

import { useState } from "react";
import { addEmployee, updateEmployee } from "@/app/actions/employeeAction";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { Camera, Save, ArrowLeft, User, Briefcase, MapPin, Heart } from "lucide-react";
import Link from "next/link";

export default function EmployeeForm({ initialData, departments = [], positions = [], isEdit }: any) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        employee_name: initialData?.employee_name || "",
        email: initialData?.email || "",
        phone: initialData?.phone || "",
        birthday: initialData?.birthday || "",
        gender: initialData?.gender ?? true,
        marital_status: initialData?.marital_status ?? false,
        cic: initialData?.cic || "",
        tax_id: initialData?.tax_id || "",
        address_p: initialData?.address_p || "",
        address_c: initialData?.address_c || "",
        hired_date: initialData?.hired_date || new Date().toISOString().split('T')[0],
        status: initialData?.status ?? true,
        id_department: initialData?.id_department || "",
        id_position: initialData?.id_position || "",
        id_user: initialData?.id_user || null,
        profile_picture: initialData?.profile_picture || "",
    });

    const [newImage, setNewImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState(initialData?.profile_picture || "");

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const supabase = createClient();
            let imageUrl = form.profile_picture;

            if (newImage) {
                const fileExt = newImage.name.split(".").pop() || "png";
                const fileName = `employees/${initialData?.id}-${Date.now()}.${fileExt}`;

                // validate
                if (newImage.size > 2 * 1024 * 1024) {
                    toast.error("Ảnh tối đa 2MB");
                    return;
                }

                if (!newImage.type.startsWith("image/")) {
                    toast.error("Chỉ được upload ảnh");
                    return;
                }

                // upload
                const { error: uploadError } = await supabase.storage.from("main").upload(fileName, newImage);
                //   const { error: uploadError } = await supabase.storage.from("main").upload(fileName, newImage);

                if (uploadError) throw uploadError;

                // lấy public url
                const { data } = supabase.storage.from("main").getPublicUrl(fileName);

                const newUrl = data.publicUrl;

                // xóa ảnh cũ nếu edit
                if (isEdit && form.profile_picture) {
                    console.log("OLD URL:", form.profile_picture);
                    const oldPath = form.profile_picture
                        ?.split("/storage/v1/object/public/main/")[1]
                        ?.split("?")[0];
                    console.log("OLD URL:", imageUrl);
                    console.log("OLD PATH:", oldPath);

                    if (oldPath) {
                        await supabase.storage.from("main").remove([oldPath]);
                    }
                }
                imageUrl = newUrl;
            }

            const payload = { ...form, profile_picture: imageUrl };
            if (isEdit) {
                await updateEmployee(initialData.id, payload);
            } else {
                await addEmployee(payload);
            }

            toast.success("Đã lưu thông tin nhân viên!");
            router.push("/manager/human-resources");
            router.refresh();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6 pb-10">
            {/* Action Bar */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm sticky top-0 z-10">
                <Link href="/manager/human-resources" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition">
                    <ArrowLeft size={20} /> Quay lại
                </Link>
                <button disabled={loading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition">
                    {loading ? "Đang xử lý..." : <><Save size={18} /> Lưu hồ sơ</>}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: Avatar & Job Info */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col items-center">
                        <div className="relative w-32 h-32">
                            <img src={previewImage || "https://ui-avatars.com/api/?name=User"} className="w-32 h-32 object-cover rounded-full border-4 border-slate-100 shadow-sm" />
                            <button type="button" onClick={() => document.getElementById("imgInput")?.click()} className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full border-2 border-white"><Camera size={16}/></button>
                            <input id="imgInput" type="file" className="hidden" onChange={handleImageChange} />
                        </div>
                        <p className="mt-4 text-sm font-bold text-slate-700 uppercase tracking-tight">Ảnh hồ sơ</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                        <h2 className="text-xs font-black text-slate-400 uppercase flex items-center gap-2"><Briefcase size={14}/> Tổ chức</h2>
                        <div>
                            <label className="text-xs font-bold text-slate-600">Phòng ban</label>
                            <select name="id_department" value={form.id_department} onChange={handleChange} className="w-full border p-2 rounded-lg mt-1 outline-none focus:border-blue-500" required>
                                <option value="">-- Chọn --</option>
                                {departments.map((d: any) => <option key={d.id} value={d.id}>{d.department_name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-600">Chức vụ</label>
                            <select name="id_position" value={form.id_position} onChange={handleChange} className="w-full border p-2 rounded-lg mt-1 outline-none focus:border-blue-500" required>
                                <option value="">-- Chọn --</option>
                                {positions.map((p: any) => <option key={p.id} value={p.id}>{p.position_name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-600">Ngày vào làm</label>
                            <input type="date" name="hired_date" value={form.hired_date} onChange={handleChange} disabled className="w-full border p-2 rounded-lg mt-1 outline-none" />
                        </div>
                    </div>
                </div>

                {/* Right: Personal Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <h2 className="text-xs font-black text-slate-400 uppercase flex items-center gap-2 mb-4"><User size={14}/> Thông tin cơ bản</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-xs font-bold text-slate-600">Họ và tên</label>
                                <input name="employee_name" value={form.employee_name} onChange={handleChange} className="w-full border p-2 rounded-lg mt-1 outline-none focus:ring-1 focus:ring-blue-500" required />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-600">Số điện thoại</label>
                                <input name="phone" value={form.phone} onChange={handleChange} className="w-full border p-2 rounded-lg mt-1 outline-none" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-600">Email</label>
                                <input name="email" value={form.email} onChange={handleChange} className="w-full border p-2 rounded-lg mt-1 outline-none" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-600">Số CCCD (CIC)</label>
                                <input name="cic" value={form.cic} onChange={handleChange} className="w-full border p-2 rounded-lg mt-1 outline-none" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-600">Mã số thuế (Tax ID)</label>
                                <input name="tax_id" value={form.tax_id} onChange={handleChange} className="w-full border p-2 rounded-lg mt-1 outline-none" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-600">Ngày sinh</label>
                                <input type="date" name="birthday" value={form.birthday} onChange={handleChange} className="w-full border p-2 rounded-lg mt-1 outline-none" />
                            </div>
                            <div className="flex gap-6 items-center">
                                <div>
                                    <label className="text-xs font-bold text-slate-600 block mb-2">Giới tính</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-1 text-sm"><input type="radio" name="gender" checked={form.gender === true} onChange={() => setForm({...form, gender: true})}/> Nam</label>
                                        <label className="flex items-center gap-1 text-sm"><input type="radio" name="gender" checked={form.gender === false} onChange={() => setForm({...form, gender: false})}/> Nữ</label>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 block mb-2">Hôn nhân</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-1 text-sm"><input type="radio" name="marital_status" checked={form.marital_status === false} onChange={() => setForm({...form, marital_status: false})}/> Độc thân</label>
                                        <label className="flex items-center gap-1 text-sm"><input type="radio" name="marital_status" checked={form.marital_status === true} onChange={() => setForm({...form, marital_status: true})}/> Kết hôn</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <h2 className="text-xs font-black text-slate-400 uppercase flex items-center gap-2 mb-4"><MapPin size={14}/> Địa chỉ</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-600">Địa chỉ thường trú (Permanent)</label>
                                <input name="address_p" value={form.address_p} onChange={handleChange} className="w-full border p-2 rounded-lg mt-1 outline-none" placeholder="Theo sổ hộ khẩu/CCCD" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-600">Địa chỉ tạm trú (Current)</label>
                                <input name="address_c" value={form.address_c} onChange={handleChange} className="w-full border p-2 rounded-lg mt-1 outline-none" placeholder="Nơi ở hiện tại" />
                            </div>
                            <div className="pt-4 border-t flex items-center gap-3">
                                <input type="checkbox" name="status" checked={form.status} onChange={handleChange} className="w-4 h-4 accent-blue-600" id="status" />
                                <label htmlFor="status" className="text-sm font-bold text-slate-700 underline decoration-blue-200">Làm việc tại công ty</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}