"use client";

import React, { useState, useMemo } from "react";
import { Search, Save, FileText, RotateCcw, Truck, User, MapPin, Phone } from "lucide-react";
import { addOrder, updateOrder } from "@/app/actions/orderAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/provider/AuthProvider";

export default function OrderInterface({ initialData }: any) {
    const router = useRouter();
    const [orders] = useState(initialData);
    const { user } = useAuth()
    
    // Khởi tạo form theo Schema Order
    const emptyForm = { 
        id: "", 
        id_user: "", // Thường lấy từ auth hoặc chọn khách hàng
        order_time: "", 
        receiver_name: "", 
        shipping_address: "",
        phone: "",
        status: "approving", 
        total_price: 0 
    };

    const [form, setForm] = useState(emptyForm);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            // Nếu order_time trống thì lấy ISO hiện tại
            const finalData = {
                ...form,
                order_time: form.order_time || new Date().toISOString()
            };

            if (form.id) {
                await updateOrder(form.id, finalData);
                toast.success("Cập nhật đơn hàng thành công");
            } else {
                const { id, ...data } = finalData;
                console.log("Creating order with data:", data);
                data.id_user = user?.id || "";
                await addOrder(data);
                toast.success("Tạo đơn hàng mới thành công");
            }
            
            setForm(emptyForm);
            router.refresh();
        } catch (err: any) { 
            toast.error(err.message); 
        }
    };

    // Filter & Sort giống bản cũ
    const filteredData = useMemo(() => {
        let result = [...orders];
        const keyword = searchTerm.trim().toLowerCase();

        if (keyword) {
            result = result.filter((o: any) => 
                o.receiver_name?.toLowerCase().includes(keyword) || 
                String(o.id).includes(keyword) ||
                o.phone?.includes(keyword)
            );
        }

        if (statusFilter !== "all") {
            result = result.filter((o: any) => o.status === statusFilter);
        }

        return result.sort((a: any, b: any) => Number(b.id) - Number(a.id));
    }, [orders, searchTerm, statusFilter]);

    const currentItems = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    // Hàm render badge trạng thái
    const renderStatusBadge = (status: string) => {
        const styles: any = {
            approving: "bg-amber-50 text-amber-600 border-amber-200",
            approved: "bg-green-50 text-green-600 border-green-200",
            shipping: "bg-blue-50 text-blue-600 border-blue-200",
            success: "bg-emerald-50 text-emerald-600 border-emerald-200",
            cancelled: "bg-slate-50 text-slate-400 border-slate-200",
        };
        const text: any = {
            approving: "Chờ duyệt",
            approved: "Đã duyệt",
            shipping: "Đang giao",
            success: "Thành công",
            cancelled: "Đã hủy",
        };
        return (
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold border ${styles[status]}`}>
                {text[status]}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Form nhanh phía trên */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden text-sm">
                <div className="bg-slate-900 p-4 text-white text-xs font-bold uppercase tracking-widest flex justify-between items-center">
                    <span>{form.id ? `Đang sửa đơn hàng #${form.id}` : "Tạo đơn hàng mới"}</span>
                    {form.id && (
                        <button onClick={() => setForm(emptyForm)} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition">
                            Hủy
                        </button>
                    )}
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><User size={12}/> Tên người nhận</label>
                            <input 
                                value={form.receiver_name} 
                                onChange={e => setForm({...form, receiver_name: e.target.value})} 
                                className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                                required 
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Phone size={12}/> Số điện thoại</label>
                            <input 
                                value={form.phone} 
                                onChange={e => setForm({...form, phone: e.target.value})} 
                                className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                                required 
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">Trạng thái</label>
                            <select 
                                value={form.status} 
                                onChange={e => setForm({...form, status: e.target.value})} 
                                className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                            >
                                <option value="approving">Chờ duyệt</option>
                                <option value="approved">Đã duyệt</option>
                                <option value="shipping">Đang giao</option>
                                <option value="success">Thành công</option>
                                <option value="cancelled">Đã hủy</option>
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100">
                                <Save size={18}/> Lưu đơn
                            </button>
                            <button type="button" onClick={() => setForm(emptyForm)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition border">
                                <RotateCcw size={18}/>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-3 space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><MapPin size={12}/> Địa chỉ giao hàng</label>
                            <input 
                                value={form.shipping_address} 
                                onChange={e => setForm({...form, shipping_address: e.target.value})} 
                                className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Thời gian (Mặc định: Bây giờ)</label>
                            <input 
                                type="datetime-local" 
                                value={form.order_time ? new Date(form.order_time).toISOString().slice(0, 16) : ""} 
                                onChange={e => setForm({...form, order_time: e.target.value})} 
                                className="w-full border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                    </div>
                </form>
            </div>

            {/* Toolbar Search & Filter */}
            <div className="bg-white p-3 rounded-xl border flex flex-wrap gap-3 shadow-sm items-center">
                <div className="relative flex-1 min-w-62.5">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Tìm tên người nhận, mã đơn hoặc số điện thoại..." 
                        value={searchTerm} 
                        onChange={e => {setSearchTerm(e.target.value); setCurrentPage(1);}} 
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    />
                </div>
                <select 
                    value={statusFilter} 
                    onChange={e => setStatusFilter(e.target.value)}
                    className="border p-2 rounded-lg text-xs font-bold outline-none bg-slate-50"
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="approving">Chờ duyệt</option>
                    <option value="approved">Đã duyệt</option>
                    <option value="shipping">Đang giao</option>
                    <option value="success">Thành công</option>
                    <option value="cancelled">Đã hủy</option>
                </select>
                <div className="text-[10px] font-black text-slate-400 uppercase">
                    Total: {filteredData.length}
                </div>
            </div>

            {/* Bảng danh sách */}
            <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-slate-700">Mã đơn</th>
                            <th className="p-4 font-semibold text-slate-700">Người nhận</th>
                            <th className="p-4 font-semibold text-slate-700">Địa chỉ giao</th>
                            <th className="p-4 font-semibold text-slate-700 text-center">Trạng thái</th>
                            <th className="p-4 font-semibold text-slate-700 text-right">Tổng tiền</th>
                            <th className="p-4 font-semibold text-slate-700 text-center">Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((item: any) => (
                            <tr 
                                key={item.id} 
                                onClick={() => setForm(item)} 
                                className={`border-b transition cursor-pointer ${form.id === item.id ? "bg-blue-50" : "hover:bg-slate-50"}`}
                            >
                                <td className="p-4 font-mono text-blue-600 font-bold text-sm">#{item.id}</td>
                                <td className="p-4">
                                    <div className="font-bold text-slate-900 leading-tight">{item.receiver_name}</div>
                                    <div className="text-[10px] text-slate-400 font-medium mt-1 uppercase flex items-center gap-1">
                                        <Phone size={10}/> {item.phone}
                                    </div>
                                </td>
                                <td className="p-4 text-[11px] text-slate-500 max-w-50 truncate">
                                    {item.shipping_address}
                                </td>
                                <td className="p-4 text-center">
                                    {renderStatusBadge(item.status)}
                                </td>
                                <td className="p-4 text-right font-black text-slate-800 text-sm">
                                    {item.total_price.toLocaleString('vi-VN')}đ
                                </td>
                                <td className="p-4 text-center">
                                    <Link 
                                        href={`/manager/stocks/orders/${item.id}`} 
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
            </div>
        </div>
    );
}