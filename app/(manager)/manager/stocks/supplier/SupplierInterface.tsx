"use client";

import React, { useState, useMemo } from "react";
import {
    Search,
    Plus,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Trash2,
    Save,
    RotateCcw,
    Building2,
    Phone,
    Mail,
    MapPin
} from "lucide-react";
import { addSupplier, updateSupplier, deleteSupplier } from "@/app/actions/supplierAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Supplier } from "@/app/utils/TypeGlobal";

export default function SupplierInterface({ initialData }: { initialData: Supplier[] }) {
    const router = useRouter();
    const [suppliers] = useState<Supplier[]>(initialData);
    const [loading, setLoading] = useState(false);

    // Form State
    const emptyForm = { id: "", supplier_name: "", phone: "", email: "", address: "" };
    const [form, setForm] = useState<Supplier>(emptyForm);

    // Search & Pagination State
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Logic: Nhấn vào dòng -> Fill lên form
    const handleSelectRow = (item: Supplier) => {
        setForm(item);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleReset = () => setForm(emptyForm);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (form.id) {
                await updateSupplier(form.id, form);
                toast.success("Đã cập nhật nhà cung cấp");
            } else {
                const { id, ...dataAdd } = form;
                await addSupplier(dataAdd);
                toast.success("Đã thêm nhà cung cấp mới");
            }
            handleReset();
            router.refresh();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa?")) return;
        try {
            await deleteSupplier(id);
            toast.success("Đã xóa nhà cung cấp");
            router.refresh();
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    // Filter Logic giống bản Employee cũ
    const filteredData = useMemo(() => {
        let result = [...suppliers];
        const keyword = searchTerm.trim().toLowerCase();
        if (keyword) {
            result = result.filter(s =>
                s.supplier_name.toLowerCase().includes(keyword) ||
                String(s.id).toLowerCase().includes(keyword) ||
                s.phone.includes(keyword) ||
                s.email.toLowerCase().includes(keyword)
            );
        }
        return result.sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, { numeric: true }));
    }, [suppliers, searchTerm]);

    const totalPages = Math.ceil(filteredData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const currentItems = filteredData.slice(startIndex, startIndex + pageSize);

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý nhà cung cấp</h1>
                    <p className="text-slate-500 text-sm">
                        Tổng số {filteredData.length} nhà cung cấp
                    </p>
                </div>
            </div>
            
            {/* FORM NHẬP LIỆU PHÍA TRÊN */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="bg-slate-900 p-4 flex justify-between items-center text-white text-sm">
                    <span className="font-bold uppercase tracking-widest">
                        {form.id ? `Chỉnh sửa Nhà cung cấp #${form.id}` : "Thêm Nhà cung cấp mới"}
                    </span>
                    {form.id && (
                        <button onClick={handleReset} className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition">
                            Thoát chế độ sửa
                        </button>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-1 space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Tên nhà cung cấp</label>
                        <input name="supplier_name" value={form.supplier_name} onChange={handleChange} required
                            className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Số điện thoại</label>
                        <input name="phone" value={form.phone} onChange={handleChange}
                            className="w-full border p-2 rounded-lg outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Email</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange}
                            className="w-full border p-2 rounded-lg outline-none" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Địa chỉ</label>
                        <input name="address" value={form.address} onChange={handleChange}
                            className="w-full border p-2 rounded-lg outline-none" />
                    </div>
                    <div className="md:col-span-4 flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={handleReset} className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                            <RotateCcw size={18} /> Làm mới
                        </button>
                        <button disabled={loading} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold">
                            <Save size={18} /> {loading ? "Đang lưu..." : "Lưu dữ liệu"}
                        </button>
                    </div>
                </form>
            </div>

            {/* TOOLBAR GIỐNG EMPLOYEE */}
            <div className="bg-white p-3 rounded-xl border flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-75">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm tên, mã, SĐT, email nhà cung cấp..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>
                <div className="flex items-center px-4 text-sm text-slate-500 italic">
                    Tổng số {filteredData.length} nhà cung cấp
                </div>
            </div>

            {/* BẢNG GIỐNG EMPLOYEE */}
            <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-slate-700">Nhà cung cấp</th>
                                <th className="p-4 font-semibold text-slate-700 text-center">ID</th>
                                <th className="p-4 font-semibold text-slate-700">Liên hệ</th>
                                <th className="p-4 font-semibold text-slate-700">Địa chỉ</th>
                                <th className="p-4 font-semibold text-slate-700 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item) => (
                                <tr key={item.id} 
                                    onClick={() => handleSelectRow(item)}
                                    className={`border-b cursor-pointer transition-colors ${form.id === item.id ? "bg-blue-50" : "hover:bg-blue-50/30"}`}>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center text-blue-600">
                                                <Building2 size={20} />
                                            </div>
                                            <div className="font-bold text-slate-900">{item.supplier_name}</div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600 border">
                                            {item.id}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1 text-xs text-slate-600">
                                            <div className="flex items-center gap-1.5"><Phone size={12}/> {item.phone}</div>
                                            <div className="flex items-center gap-1.5"><Mail size={12}/> {item.email}</div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-600 italic">
                                        <div className="flex items-start gap-1.5"><MapPin size={14} className="mt-0.5 shrink-0"/> {item.address}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:text-red-600 transition">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PHÂN TRANG GIỐNG EMPLOYEE */}
                <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 border-t">
                    <div className="text-xs font-medium text-slate-500">
                        Hiển thị {startIndex + 1} - {Math.min(startIndex + pageSize, filteredData.length)} / {filteredData.length}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)} className="p-1.5 border rounded-md bg-white disabled:opacity-30">
                            <ChevronsLeft size={16} />
                        </button>
                        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} className="p-1.5 border rounded-md bg-white disabled:opacity-30">
                            <ChevronLeft size={16} />
                        </button>
                        <div className="px-3 py-1 bg-white border rounded-md text-xs font-bold text-blue-600 shadow-sm">
                            {currentPage} / {totalPages || 1}
                        </div>
                        <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} className="p-1.5 border rounded-md bg-white disabled:opacity-30">
                            <ChevronRight size={16} />
                        </button>
                        <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(totalPages)} className="p-1.5 border rounded-md bg-white disabled:opacity-30">
                            <ChevronsRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}