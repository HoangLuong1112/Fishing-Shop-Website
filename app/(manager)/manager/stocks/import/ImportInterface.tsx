"use client";

import React, { useState, useMemo } from "react";
import { Search, Save, FileText, RotateCcw } from "lucide-react";
import { addImport, updateImport } from "@/app/actions/importAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ImportInterface({ initialData, suppliers, employees }: any) {
    const router = useRouter();
    const [imports] = useState(initialData);
    
    // Khởi tạo form, ngày để trống để lát xử lý logic "mặc định hiện tại"
    const emptyForm = { 
        id: "", 
        id_supplier: "", 
        id_employee: "", 
        import_date: "", // Để trống để nhận diện người dùng có chọn hay không
        note: "", 
        total_cost: 0 
    };

    const [form, setForm] = useState(emptyForm);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            // Logic: Nếu import_date trống thì lấy ISO string hiện tại
            const finalData = {
                ...form,
                import_date: form.import_date || new Date().toISOString()
            };

            if (form.id) {
                await updateImport(form.id, finalData);
                toast.success("Cập nhật phiếu nhập thành công");
            } else {
                const { id, ...data } = finalData;
                await addImport(data);
                toast.success("Tạo phiếu nhập mới thành công");
            }
            
            setForm(emptyForm);
            router.refresh();
        } catch (err: any) { 
            toast.error(err.message); 
        }
    };

    // Filter & Sort
    const filteredData = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();
        return imports.filter((i: any) => 
            i.supplier_name?.toLowerCase().includes(keyword) || 
            String(i.id).includes(keyword)
        ).sort((a: any, b: any) => Number(b.id) - Number(a.id));
    }, [imports, searchTerm]);

    const currentItems = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="space-y-6">
            {/* Form nhanh phía trên */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="bg-slate-900 p-4 text-white text-xs font-bold uppercase tracking-widest flex justify-between items-center">
                    <span>{form.id ? `Đang hiệu chỉnh phiếu #${form.id}` : "Lập phiếu nhập kho mới"}</span>
                    {form.id && (
                        <button onClick={() => setForm(emptyForm)} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition">
                            Hủy chỉnh sửa
                        </button>
                    )}
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Nhà cung cấp</label>
                            <select 
                                value={form.id_supplier} 
                                onChange={e => setForm({...form, id_supplier: e.target.value})} 
                                className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" 
                                required
                            >
                                <option value="">-- Chọn NCC --</option>
                                {suppliers.map((s: any) => <option key={s.id} value={s.id}>{s.supplier_name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Nhân viên lập</label>
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
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Ngày nhập (Mặc định: Bây giờ)</label>
                            <input 
                                type="datetime-local" 
                                value={form.import_date} 
                                onChange={e => setForm({...form, import_date: e.target.value})} 
                                className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>

                        <div className="flex gap-2">
                            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100">
                                <Save size={18}/> {form.id ? "Cập nhật phiếu" : "Lưu phiếu nhập"}
                            </button>
                            <button type="button" onClick={() => setForm(emptyForm)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition border">
                                <RotateCcw size={18}/>
                            </button>
                        </div>
                    </div>

                    {/* Ô Ghi chú nằm riêng một dòng cho rộng rãi */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Ghi chú phiếu nhập</label>
                        <textarea 
                            rows={1}
                            name="note"
                            value={form.note}
                            onChange={e => setForm({...form, note: e.target.value})}
                            placeholder="Nhập ghi chú hoặc lý do nhập kho (nếu có)..."
                            className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 resize-none"
                        />
                    </div>
                </form>
            </div>

            {/* Toolbar Search */}
            <div className="bg-white p-3 rounded-xl border flex gap-3 shadow-sm items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm theo mã phiếu hoặc tên nhà cung cấp..." 
                        value={searchTerm} 
                        onChange={e => {setSearchTerm(e.target.value); setCurrentPage(1);}} 
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    />
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase pr-2">
                    Tổng: {filteredData.length} phiếu
                </div>
            </div>

            {/* Bảng danh sách */}
            <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-slate-700">Mã phiếu</th>
                            <th className="p-4 font-semibold text-slate-700">Nhà cung cấp</th>
                            <th className="p-4 font-semibold text-slate-700">Ngày lập</th>
                            <th className="p-4 font-semibold text-slate-700 text-right">Tổng tiền</th>
                            <th className="p-4 font-semibold text-slate-700 text-center">Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item: any) => (
                            <tr 
                                key={item.id} 
                                onClick={() => setForm({
                                    id: item.id,
                                    id_supplier: item.id_supplier,
                                    id_employee: item.id_employee,
                                    import_date: item.import_date ? new Date(item.import_date).toISOString().slice(0, 16) : "",
                                    note: item.note || "",
                                    total_cost: item.total_cost
                                })} 
                                className={`border-b transition cursor-pointer ${form.id === item.id ? "bg-blue-50" : "hover:bg-slate-50"}`}
                            >
                                <td className="p-4 font-mono text-blue-600 font-bold text-sm">#{item.id}</td>
                                <td className="p-4">
                                    <div className="font-bold text-slate-900 leading-tight">{item.supplier_name}</div>
                                    <div className="text-[10px] text-slate-400 uppercase font-medium mt-1">NV: {item.employee_name}</div>
                                </td>
                                <td className="p-4 text-sm text-slate-600">
                                    {new Date(item.import_date).toLocaleString('vi-VN', {
                                        year: 'numeric', month: '2-digit', day: '2-digit',
                                        hour: '2-digit', minute: '2-digit'
                                    })}
                                </td>
                                <td className="p-4 text-right font-black text-emerald-600">
                                    {item.total_cost.toLocaleString('vi-VN')}đ
                                </td>
                                <td className="p-4 text-center">
                                    <Link 
                                        href={`/manager/stocks/import/${item.id}`} 
                                        onClick={(e) => e.stopPropagation()}
                                        className="bg-white border hover:bg-slate-50 p-2 rounded-lg inline-flex items-center gap-1 text-[10px] font-black uppercase transition shadow-sm"
                                    >
                                        <FileText size={14} className="text-blue-500"/> Xem
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredData.length === 0 && (
                    <div className="p-10 text-center text-slate-400 italic text-sm">
                        Không tìm thấy dữ liệu phiếu nhập kho phù hợp.
                    </div>
                )}
            </div>
        </div>
    );
}