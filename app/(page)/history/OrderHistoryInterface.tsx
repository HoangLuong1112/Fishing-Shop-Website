'use client'

import Link from "next/link";
import { Package, Calendar, Tag, Truck, Info } from "lucide-react";

// Mock data đã bổ sung trường Export để bạn dễ hình dung
const MOCK_ORDERS = [
    {
        id: "1001",
        order_time: new Date().toISOString(),
        status: "success",
        total_price: 1250000,
        OrderItems: [
            {
                quantity: 1,
                item_price: 1250000,
                Product: {
                    product_name: "Cần câu Shimano LunaMis S86ML",
                    image_url: "https://via.placeholder.com/150"
                }
            }
        ],
        Export: {
            export_date: new Date().toISOString(),
            note: "Đã bọc chống sốc cẩn thận, đóng ống nhựa PVC."
        }
    },
    {
        id: "1002",
        order_time: new Date().toISOString(),
        status: "shipping",
        total_price: 450000,
        OrderItems: [
            {
                quantity: 2,
                item_price: 225000,
                Product: {
                    product_name: "Mồi câu cá giả cao cấp",
                    image_url: "https://via.placeholder.com/150"
                }
            }
        ],
        Export: null // Đơn hàng chưa xuất kho
    }
];

export default function OrderHistoryInterface({ initialData }: any) {
    let orders = initialData || []
    if (!orders || orders.length === 0) orders = MOCK_ORDERS;

    const getStatusLabel = (status: string) => {
        const map: Record<string, { label: string; color: string; dot: string }> = {
            approving: { label: "Chờ duyệt", color: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-400" },
            approved: { label: "Đã duyệt", color: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-400" },
            shipping: { label: "Đang giao", color: "bg-indigo-50 text-indigo-700 border-indigo-200", dot: "bg-indigo-400" },
            success: { label: "Thành công", color: "bg-green-50 text-green-700 border-green-200", dot: "bg-green-400" },
            cancelled: { label: "Đã hủy", color: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-400" },
        };
        return map[status] || { label: status, color: "bg-gray-50 text-gray-700 border-gray-200", dot: "bg-gray-400" };
    };

    return (
        <main className="min-h-screen bg-[#f8f9fa] py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                            Lịch sử <span className="text-orange-600">Đơn hàng</span>
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Theo dõi quá trình vận chuyển và nhận hàng</p>
                    </div>
                    <Link href="/" className="group flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                        <span>← Quay lại cửa hàng</span>
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white p-20 rounded-[2rem] text-center shadow-sm border border-gray-100">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package className="text-gray-300" size={32} />
                        </div>
                        <p className="text-gray-500 font-medium mb-6">Bạn chưa có giao dịch nào gần đây.</p>
                        <Link href="/" className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-orange-600 transition-all active:scale-95">
                            Bắt đầu mua sắm ngay
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order: any) => {
                            const statusInfo = getStatusLabel(order.status);
                            return (
                                <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                    
                                    {/* Order Top Header */}
                                    <div className="px-6 py-5 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4 bg-white">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                                                <Tag size={14} />
                                                Mã đơn: <span className="text-gray-900">#{order.id}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar size={14} />
                                                {new Date(order.order_time).toLocaleDateString('vi-VN', { 
                                                    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                                                })}
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-tight ${statusInfo.color}`}>
                                            <span className={`w-2 h-2 rounded-full ${statusInfo.dot} animate-pulse`}></span>
                                            {statusInfo.label}
                                        </div>
                                    </div>

                                    {/* Product List */}
                                    <div className="p-6 space-y-5">
                                        {order.OrderItems.map((item: any, idx: number) => (
                                            <div key={idx} className="flex gap-5 items-center group">
                                                <div className="relative w-20 h-20 bg-gray-50 rounded-2xl shrink-0 overflow-hidden border border-gray-100">
                                                    <img 
                                                        src={item.Product?.image_url || "/placeholder.jpg"} 
                                                        alt="" 
                                                        className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform"
                                                    />
                                                </div>
                                                <div className="grow space-y-1">
                                                    <h4 className="text-[15px] font-bold text-gray-900 leading-tight">
                                                        {item.Product?.product_name}
                                                    </h4>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">x{item.quantity}</span>
                                                        <span className="text-sm font-medium text-gray-400 italic">Đơn giá: {item.item_price.toLocaleString('vi-VN')}₫</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[15px] font-black text-gray-900">
                                                        {(item.item_price * item.quantity).toLocaleString('vi-VN')}₫
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* EXPORT INFO BOX (Phần mới) */}
                                    {order.Export && (
                                        <div className="mx-6 mb-6 p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex gap-4">
                                            <div className="mt-1 text-blue-600">
                                                <Truck size={20} />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-black text-blue-800 uppercase tracking-wider">Thông tin xuất kho</span>
                                                    <span className="text-[10px] text-blue-400 font-bold">●</span>
                                                    <span className="text-[13px] font-bold text-blue-700">
                                                        {new Date(order.Export.export_date).toLocaleDateString('vi-VN')}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-blue-600 leading-relaxed italic">
                                                    "{order.Export.note || "Kiện hàng đã sẵn sàng giao cho đơn vị vận chuyển."}"
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Order Footer */}
                                    <div className="px-6 py-5 bg-gray-50/80 border-t border-gray-100 flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Info size={16} />
                                            <span className="text-xs font-bold uppercase tracking-widest">Thanh toán</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 font-bold uppercase mb-1">Tổng tiền thanh toán</p>
                                            <span className="text-2xl font-black text-orange-600 tracking-tighter">
                                                {order.total_price.toLocaleString('vi-VN')}₫
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                
            </div>
        </main>
    );
}