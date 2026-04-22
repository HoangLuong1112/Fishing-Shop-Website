"use client";

import React, { useState } from "react";
import { 
    Box, 
    FileUp, 
    Truck, 
    ShoppingCart, 
    CheckCircle2, 
    Clock, 
    ArrowRight,
    Phone,
    MapPin,
    XCircle,
    ClipboardList
} from "lucide-react";
import Link from "next/link";
import { approveOrder } from "@/app/actions/orderAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function StocksDashboard({ initialOrders }: any) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const handleApprove = async (id: string, approve: boolean) => {
        setLoadingId(id);
        try {
            await approveOrder(id, approve);
            toast.success(`Đã ${approve ? 'duyệt' : 'hủy'} đơn hàng #${id}`);
            router.refresh();
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoadingId(null);
        }
    };

    const navigationCards = [
        { title: "Nhập hàng", desc: "Quản lý phiếu nhập kho", icon: Box, color: "bg-blue-600", href: "/manager/stocks/import" },
        { title: "Xuất hàng", desc: "Quản lý phiếu xuất kho", icon: FileUp, color: "bg-orange-500", href: "/manager/stocks/export" },
        { title: "Nhà cung cấp", desc: "Danh sách đối tác", icon: Truck, color: "bg-indigo-600", href: "/manager/stocks/supplier" },
        { title: "Đơn hàng", desc: "Toàn bộ đơn khách hàng", icon: ShoppingCart, color: "bg-slate-800", href: "/manager/stocks/orders" },
    ];

    return (
        <div className="space-y-10">
            {/* 4 NÚT QUẢN LÝ NHANH */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {navigationCards.map((card, idx) => (
                    <Link key={idx} href={card.href} className="group relative bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                        <div className="flex items-center gap-4">
                            <div className={`${card.color} p-3 rounded-xl text-white shadow-lg`}>
                                <card.icon size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-800 uppercase text-sm tracking-tighter">{card.title}</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">{card.desc}</p>
                            </div>
                        </div>
                        <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-200 group-hover:text-slate-400 transition-colors" size={20} />
                    </Link>
                ))}
            </div>

            {/* BẢNG ĐƠN HÀNG CHỜ DUYỆT */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <div className="bg-amber-100 text-amber-600 p-1.5 rounded-lg">
                        <Clock size={18} />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 uppercase italic">Đơn hàng chờ phê duyệt</h2>
                    <span className="ml-auto bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        {initialOrders.length} ĐƠN MỚI
                    </span>
                </div>

                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="p-4 text-[10px] font-black text-slate-500 uppercase">Mã đơn</th>
                                    <th className="p-4 text-[10px] font-black text-slate-500 uppercase">Người nhận / SĐT</th>
                                    <th className="p-4 text-[10px] font-black text-slate-500 uppercase">Địa chỉ</th>
                                    <th className="p-4 text-[10px] font-black text-slate-500 uppercase text-right">Tổng tiền</th>
                                    <th className="p-4 text-[10px] font-black text-slate-500 uppercase text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {initialOrders.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="p-4">
                                            <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                                #{order.id}
                                            </span>
                                            <div className="text-[9px] text-slate-400 mt-1 font-bold">
                                                {new Date(order.order_time).toLocaleString('vi-VN')}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-slate-800 text-sm">{order.receiver_name}</div>
                                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                                                <Phone size={10} /> {order.phone}
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs text-slate-500 max-w-62.5 truncate italic">
                                            <div className="flex items-start gap-1">
                                                <MapPin size={12} className="shrink-0 mt-0.5 text-slate-300" />
                                                {order.shipping_address}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="font-black text-slate-900 text-sm">
                                                {order.total_price.toLocaleString('vi-VN')}đ
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                disabled={loadingId === order.id}
                                                onClick={() => handleApprove(order.id, true)}
                                                className="group relative bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-xl transition-all shadow-lg shadow-emerald-100 disabled:opacity-50 inline-flex items-center gap-2 px-4"
                                            >
                                                {loadingId === order.id ? "..." : <CheckCircle2 size={16} />}
                                                
                                                {/* <span className="text-[10px] font-black uppercase">
                                                    {loadingId === order.id ? "..." : ""}
                                                </span> */}
                                            </button>
                                            <button
                                                disabled={loadingId === order.id}
                                                onClick={() => handleApprove(order.id, false)}
                                                className="group relative bg-red-500 hover:bg-red-600 text-white p-2 rounded-xl transition-all shadow-lg shadow-red-100 disabled:opacity-50 inline-flex items-center gap-2 px-4 mt-2"
                                            >
                                                <XCircle size={16} />
                                                {/* <span className="text-[10px] font-black uppercase">
                                                    {loadingId === order.id ? "..." : ""}
                                                </span> */}
                                            </button>
                                            <Link href={`/manager/stocks/orders/${order.id}`} 
                                                className="group relative bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-xl transition-all shadow-lg shadow-red-100 disabled:opacity-50 inline-flex items-center gap-2 px-4 mt-2">
                                                <ClipboardList size={16} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {initialOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-20 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="bg-slate-50 p-4 rounded-full">
                                                    <CheckCircle2 size={40} className="text-slate-200" />
                                                </div>
                                                <p className="text-xs font-black text-slate-300 uppercase tracking-widest">Tuyệt vời! Không có đơn hàng nào chờ duyệt</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}