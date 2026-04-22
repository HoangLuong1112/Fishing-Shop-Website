"use client";

import React, { useState, useMemo } from "react";
import { Search, Save, FileText, RotateCcw, User, Hash, Calendar } from "lucide-react";
import { addExport, updateExport } from "@/app/actions/exportAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ExportInterface({ initialData, employees, orders }: any) {
    const router = useRouter();
    const [exports] = useState(initialData);
    
    const emptyForm = { 
        id: "", 
        id_employee: "", 
        id_order: "", 
        export_date: "", 
        note: "" 
    };

    const [form, setForm] = useState(emptyForm);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // Lọc danh sách order cho thẻ Select
    const availableOrders = useMemo(() => {
        if (form.id) {
            // Nếu đang sửa: tắt luôn cái ô chọn đơn hàng
            return orders;
        }
        // Nếu thêm mới // approving, approved, shipping, success, cancelled
        return orders.filter((o: any) => o.status === "approved");
    }, [orders, form.id]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const finalData = {
                ...form,
                export_date: form.export_date || new Date().toISOString()
            };

            if (form.id) {
                await updateExport(form.id, finalData);
                toast.success("Cập nhật phiếu xuất thành công");
            } else {
                const { id, ...data } = finalData;
                await addExport(data);
                toast.success("Tạo phiếu xuất kho thành công");
            }
            
            setForm(emptyForm);
            router.refresh();
        } catch (err: any) { 
            toast.error(err.message); 
        }
    };

    const filteredData = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();
        return exports.filter((ex: any) => 
            ex.employee_name?.toLowerCase().includes(keyword) || 
            String(ex.id_order).includes(keyword) ||
            String(ex.id).includes(keyword)
        ).sort((a: any, b: any) => Number(b.id) - Number(a.id));
    }, [exports, searchTerm]);

    const currentItems = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="space-y-6">
            {/* Form nhanh phía trên */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden text-sm">
                <div className="bg-slate-900 p-4 text-white text-xs font-bold uppercase tracking-widest flex justify-between items-center">
                    <span>{form.id ? `Đang sửa phiếu xuất #${form.id}` : "Lập phiếu xuất kho mới"}</span>
                    {form.id && (
                        <button onClick={() => setForm(emptyForm)} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition">
                            Hủy
                        </button>
                    )}
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Hash size={12}/> Đơn hàng có thể xuất</label>
                            <select 
                                {...form.id ? { disabled: true } : {}}
                                value={form.id_order} 
                                onChange={e => setForm({...form, id_order: e.target.value})} 
                                className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-bold" 
                                required
                            >
                                <option value="">-- Chọn đơn hàng --</option>
                                {availableOrders.map((o: any) => (
                                    <option key={o.id} value={o.id}>Đơn #{o.id} - {o.receiver_name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><User size={12}/> Nhân viên thực hiện</label>
                            <select 
                                value={form.id_employee} 
                                onChange={e => setForm({...form, id_employee: e.target.value})} 
                                className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" 
                                required
                            >
                                <option value="">-- Chọn NV --</option>
                                {employees.map((e: any) => <option key={e.id} value={e.id}>{e.employee_name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Calendar size={12}/> Ngày xuất (Mặc định hiện tại)</label>
                            <input 
                                disabled
                                type="datetime-local" 
                                value={form.export_date ? new Date(form.export_date).toISOString().slice(0, 16) : ""} 
                                onChange={e => setForm({...form, export_date: e.target.value})} 
                                className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>

                        <div className="flex gap-2">
                            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100">
                                <Save size={18}/> Lưu phiếu
                            </button>
                            <button type="button" onClick={() => setForm(emptyForm)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition border">
                                <RotateCcw size={18}/>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Ghi chú xuất kho</label>
                        <textarea 
                            rows={1}
                            value={form.note}
                            onChange={e => setForm({...form, note: e.target.value})}
                            placeholder="Nhập ghi chú xuất kho nếu có..."
                            className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 resize-none"
                        />
                    </div>
                </form>
            </div>

            {/* Toolbar Search */}
            <div className="bg-white p-3 rounded-xl border flex gap-3 shadow-sm items-center">
                <div className="relative flex-1 min-w-62.5">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm mã phiếu, mã đơn hoặc tên nhân viên..." 
                        value={searchTerm} 
                        onChange={e => {setSearchTerm(e.target.value); setCurrentPage(1);}} 
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    />
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase">
                    Total: {filteredData.length} phiếu
                </div>
            </div>

            {/* Bảng danh sách */}
            <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-slate-700">Mã xuất</th>
                            <th className="p-4 font-semibold text-slate-700">Đơn hàng liên kết</th>
                            <th className="p-4 font-semibold text-slate-700">Nhân viên xuất</th>
                            <th className="p-4 font-semibold text-slate-700">Ngày xuất</th>
                            <th className="p-4 font-semibold text-slate-700 text-center">Chi tiết đơn</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item: any) => (
                            <tr 
                                key={item.id} 
                                onClick={() => setForm({
                                    id: item.id,
                                    id_employee: item.id_employee,
                                    id_order: item.id_order,
                                    export_date: item.export_date ? new Date(item.export_date).toISOString().slice(0, 16) : "",
                                    note: item.note || ""
                                })} 
                                className={`border-b transition cursor-pointer ${form.id === item.id ? "bg-blue-50" : "hover:bg-slate-50"}`}
                            >
                                <td className="p-4 font-mono text-slate-400 text-sm">#EX-{item.id}</td>
                                <td className="p-4">
                                    <div className="font-bold text-blue-600 text-sm">Đơn hàng #{item.id_order}</div>
                                    {item.note && <div className="text-[10px] text-slate-400 italic truncate max-w-50">"{item.note}"</div>}
                                </td>
                                <td className="p-4 text-sm font-medium text-slate-900">{item.employee_name}</td>
                                <td className="p-4 text-sm text-slate-600">
                                    {new Date(item.export_date).toLocaleString('vi-VN')}
                                </td>
                                <td className="p-4 text-center">
                                    <Link 
                                        href={`/manager/stocks/orders/${item.id_order}`} 
                                        onClick={(e) => e.stopPropagation()}
                                        className="bg-white border hover:bg-slate-50 p-2 rounded-lg inline-flex items-center gap-1 text-[10px] font-black uppercase transition shadow-sm"
                                    >
                                        <FileText size={14} className="text-orange-500"/> Xem đơn
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}