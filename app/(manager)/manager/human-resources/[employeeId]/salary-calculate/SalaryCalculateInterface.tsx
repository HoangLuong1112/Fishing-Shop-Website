// app/(manager)/manager/human-resources/[employeeId]/salary-calculate/SalaryCalculateInterface.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
    Plus, Trash2, Save, Calculator, 
    ArrowLeft, Landmark, ReceiptText, AlertCircle 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Salary, SalaryDetail } from "@/app/utils/TypeGlobal";
import { saveSalaryChanges } from "@/app/actions/salaryAction";
import { toast } from "sonner";

interface Props {
    initialSalary: any; // Salary & { SalaryDetail: SalaryDetail[] }
    month: number;
    year: number;
    employeeId: string;
}

export default function SalaryCalculateInterface({ initialSalary, month, year, employeeId }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    // Quản lý danh sách chi tiết lương trong state để chỉnh sửa local
    const [details, setDetails] = useState<SalaryDetail[]>(initialSalary?.SalaryDetail || []);

    // Hàm tính toán tổng lương (Hàm này chạy mỗi khi mớ details thay đổi)
    const finalSalary = useMemo(() => {
        return details.reduce((acc, item) => {
            const val = Number(item.amount) || 0;
            if (item.detail_calculation === "add") return acc + val;
            if (item.detail_calculation === "sub") return acc - val;
            return acc;
        }, 0);
    }, [details]);

    // Thêm một khoản mới (Bonus/Penalty)
    const addNewDetail = () => {
        const newRow: any = {
            id: `temp-${Date.now()}`,
            id_salary: initialSalary.id,
            detail: "Khoản mới",
            detail_calculation: "add",
            amount: 0,
            note: ""
        };
        setDetails([...details, newRow]);
    };

    // Cập nhật giá trị một dòng
    const updateDetail = (index: number, field: keyof SalaryDetail, value: any) => {
        const newDetails = [...details];
        newDetails[index] = { ...newDetails[index], [field]: value };
        setDetails(newDetails);
    };

    // Xóa dòng
    const removeDetail = (index: number) => {
        setDetails(details.filter((_, i) => i !== index));
    };

    // Lưu vào Database
    const handleSave = async () => {
        setLoading(true);
        try {
            await saveSalaryChanges(initialSalary.id, details);
            toast.success("Đã cập nhật bảng lương và tính toán lại tổng tiền!");
            router.refresh();
        } catch (error) {
            toast.error("Lỗi khi lưu bảng lương");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            {/* Header điều hướng */}
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => router.back()} 
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition"
                >
                    <ArrowLeft size={20} /> Quay lại
                </button>
                <div className="text-right">
                    <h1 className="text-2xl font-bold text-slate-900">Tính lương tháng {month}/{year}</h1>
                    <p className="text-sm text-slate-500">Mã bảng lương: #{initialSalary?.id}</p>
                </div>
            </div>

            {/* Thẻ Tổng quát */}
            <div className="bg-blue-600 rounded-2xl p-8 text-white shadow-lg shadow-blue-200 flex justify-between items-center">
                <div>
                    <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Tổng lương thực nhận (Final)</p>
                    <h2 className="text-4xl font-bold mt-2">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalSalary)}
                    </h2>
                </div>
                <div className="bg-white/10 p-4 rounded-full">
                    <Landmark size={48} className="opacity-50" />
                </div>
            </div>

            {/* Danh sách chi tiết */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                    <div className="flex items-center gap-2 font-semibold text-slate-700">
                        <ReceiptText size={20} />
                        Chi tiết các khoản cộng/trừ
                    </div>
                    <button 
                        onClick={addNewDetail}
                        className="flex items-center gap-1.5 text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition border border-blue-200"
                    >
                        <Plus size={16} /> Thêm khoản
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-slate-500 text-xs uppercase border-b bg-slate-50/50">
                                <th className="p-4 w-1/3">Nội dung</th>
                                <th className="p-4 w-24">Loại</th>
                                <th className="p-4 w-40">Số tiền (VNĐ)</th>
                                <th className="p-4">Ghi chú</th>
                                <th className="p-4 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {details.map((item, index) => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-3">
                                        <input 
                                            className="w-full bg-transparent border-b border-transparent focus:border-blue-400 outline-none p-1 font-medium text-slate-700"
                                            value={item.detail}
                                            onChange={(e) => updateDetail(index, "detail", e.target.value)}
                                        />
                                    </td>
                                    <td className="p-3">
                                        <select 
                                            className="bg-transparent outline-none text-sm font-semibold"
                                            value={item.detail_calculation}
                                            onChange={(e) => updateDetail(index, "detail_calculation", e.target.value)}
                                        >
                                            <option value="add" className="text-green-600">(+) Cộng</option>
                                            <option value="sub" className="text-red-600">(-) Trừ</option>
                                            <option value="none" className="text-slate-400">Không tính</option>
                                        </select>
                                    </td>
                                    <td className="p-3">
                                        <input 
                                            type="number"
                                            className="w-full bg-slate-50 border rounded px-2 py-1 text-sm font-mono text-right outline-none focus:ring-1 focus:ring-blue-500"
                                            value={item.amount}
                                            onChange={(e) => updateDetail(index, "amount", Number(e.target.value))}
                                        />
                                    </td>
                                    <td className="p-3">
                                        <input 
                                            className="w-full bg-transparent border-b border-transparent focus:border-blue-400 outline-none p-1 text-xs text-slate-500 italic"
                                            placeholder="Thêm ghi chú..."
                                            value={item.note || ""}
                                            onChange={(e) => updateDetail(index, "note", e.target.value)}
                                        />
                                    </td>
                                    <td className="p-3">
                                        <button 
                                            onClick={() => removeDetail(index)}
                                            className="text-slate-300 hover:text-red-500 transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Nút Lưu */}
                <div className="p-6 bg-slate-50 border-t flex justify-end">
                    <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-2.5 rounded-xl font-bold transition shadow-lg shadow-green-100 disabled:bg-slate-300"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Save size={20} />
                        )}
                        Lưu & Hoàn tất bảng lương
                    </button>
                </div>
            </div>

            {/* Thông báo nhắc nhở */}
            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm">
                <AlertCircle size={18} className="mt-0.5" />
                <div>
                    <p className="font-semibold">Lưu ý về quy trình:</p>
                    <ul className="list-disc ml-4 mt-1 space-y-1 opacity-80">
                        <li>Hệ thống đã tự động quét <b>Position Base Salary</b> và <b>Leave Requests</b> bị từ chối.</li>
                        <li>Nghỉ phép ở trạng thái <i>Pending</i> hoặc <i>Approved</i> được tính là 0đ (không trừ lương).</li>
                        <li>Mọi thay đổi chỉ có hiệu lực sau khi bạn nhấn nút <b>"Lưu & Hoàn tất"</b>.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}