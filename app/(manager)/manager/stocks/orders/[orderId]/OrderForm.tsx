"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus, Save, Trash2, ArrowLeft, Info, ShoppingBag } from "lucide-react";
import { addOrderItem, updateOrderItem, deleteOrderItem } from "@/app/actions/orderAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OrderForm({ orderInfo, initialDetails, products }: any) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    // Form nhập sản phẩm cho đơn hàng
    const [itemForm, setItemForm] = useState({ id: "", id_product: "", quantity: 1, price: 0 });
    const [productSearch, setProductSearch] = useState("");

    // Tìm kiếm sản phẩm thông minh (Dropdown gợi ý)
    const productOptions = useMemo(() => {
        if (!productSearch || itemForm.id_product) return []; // Tắt gợi ý khi đã chọn xong
        const keyword = productSearch.toLowerCase();
        return products.filter((p: any) => 
            p.product_name.toLowerCase().includes(keyword) ||
            String(p.id).includes(keyword)
        ).slice(0, 5);
    }, [products, productSearch, itemForm.id_product]);

    const handleAddItem = async (e: any) => {
        e.preventDefault();
        if (!itemForm.id_product) return toast.error("Vui lòng chọn sản phẩm");
        
        setLoading(true);
        try {
            const payload = { ...itemForm, id_order: orderInfo.id };
            if (itemForm.id) {
                await updateOrderItem(itemForm.id, payload);
                toast.success("Đã cập nhật số lượng/giá");
            } else {
                await addOrderItem(payload);
                toast.success("Đã thêm sản phẩm vào đơn hàng");
            }
            // Reset form
            setItemForm({ id: "", id_product: "", quantity: 1, price: 0 });
            setProductSearch("");
            router.refresh();
        } catch (err: any) { 
            toast.error(err.message); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Xóa sản phẩm này khỏi đơn hàng?")) return;
        try {
            await deleteOrderItem(id);
            toast.success("Đã xóa sản phẩm");
            router.refresh();
        } catch (err: any) { 
            toast.error(err.message); 
        }
    };

    // Hàm render trạng thái đơn hàng (Badge màu)
    const renderStatus = (status: string) => {
        const colors: any = { approving: "text-amber-500", approved: "text-green-500", shipping: "text-blue-500", success: "text-emerald-500", cancelled: "text-red-500" };
        const labels: any = { approving: "Chờ duyệt", approved: "Đã duyệt", shipping: "Đang giao", success: "Thành công", cancelled: "Đã hủy" };
        return <span className={`font-black uppercase ${colors[status] || "text-slate-400"}`}>{labels[status] || status}</span>;
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Top Bar: Back & Total Summary */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
                <Link href="/manager/stocks/orders" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition font-bold uppercase text-xs tracking-tighter">
                    <ArrowLeft size={20}/> Quay lại danh sách
                </Link>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Trạng thái phiếu</div>
                        <div className="text-sm">{renderStatus(orderInfo.status)}</div>
                    </div>
                    <div className="h-10 w-px bg-slate-100"></div>
                    <div className="text-right">
                        <div className="text-[10px] text-slate-400 font-bold uppercase">Tổng thanh toán</div>
                        <div className="text-2xl font-black text-blue-600">
                            {orderInfo.total_price.toLocaleString('vi-VN')}đ
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cột trái: Form nhập sản phẩm & Info đơn hàng */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                        <div className="bg-slate-900 p-4 text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            <ShoppingBag size={14}/> {itemForm.id ? "Sửa số lượng" : "Thêm SP vào đơn"}
                        </div>
                        <form onSubmit={handleAddItem} className="p-6 space-y-4">
                            <div className="relative">
                                <label className="text-xs font-bold text-slate-500 uppercase">Tìm kiếm sản phẩm</label>
                                <input 
                                    type="text" 
                                    placeholder="Tên sản phẩm hoặc mã..." 
                                    value={productSearch}
                                    onChange={e => {
                                        setProductSearch(e.target.value);
                                        if (itemForm.id_product) setItemForm({...itemForm, id_product: ""}); // Reset ID khi gõ lại
                                    }}
                                    className="w-full border p-2 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 font-medium"
                                />
                                {productOptions.length > 0 && (
                                    <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-2xl overflow-hidden">
                                        {productOptions.map((p: any) => (
                                            <div key={p.id} onClick={() => {
                                                setItemForm({...itemForm, id_product: p.id, price: p.price});
                                                setProductSearch(p.product_name);
                                            }} className="p-3 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b last:border-0 transition">
                                                <span className="text-sm font-bold text-slate-700">{p.product_name}</span>
                                                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono">#{p.id}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Số lượng</label>
                                    <input type="number" min="1" value={itemForm.quantity} onChange={e => setItemForm({...itemForm, quantity: Number(e.target.value)})} className="w-full border p-2 rounded-lg mt-1 font-bold outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Đơn giá bán</label>
                                    <input type="number" value={itemForm.price} onChange={e => setItemForm({...itemForm, price: Number(e.target.value)})} className="w-full border p-2 rounded-lg mt-1 text-blue-600 font-black outline-none" />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-black flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-100 uppercase text-sm">
                                <Plus size={18}/> {itemForm.id ? "Cập nhật dòng này" : "Xác nhận thêm"}
                            </button>
                            
                            <Link href="/manager/products/new" className="block text-center text-[10px] font-bold text-slate-400 hover:text-blue-600 transition underline uppercase tracking-tighter">
                                Tạo mới sản phẩm nếu chưa có
                            </Link>
                        </form>
                    </div>

                    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-2"><Info size={14}/> Thông tin khách hàng</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm border-b pb-2 border-dashed">
                                <span className="text-slate-500">Người nhận:</span>
                                <span className="font-bold text-slate-800">{orderInfo.receiver_name}</span>
                            </div>
                            <div className="flex justify-between text-sm border-b pb-2 border-dashed">
                                <span className="text-slate-500">Điện thoại:</span>
                                <span className="font-mono text-slate-800">{orderInfo.phone}</span>
                            </div>
                            <div className="text-sm">
                                <span className="text-slate-500 block mb-1">Địa chỉ giao:</span>
                                <span className="text-slate-800 italic leading-snug">{orderInfo.shipping_address}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cột phải: Bảng chi tiết sản phẩm trong đơn hàng */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="p-4 font-bold text-slate-600 text-xs uppercase">Sản phẩm</th>
                                    <th className="p-4 font-bold text-slate-600 text-xs uppercase text-center">SL</th>
                                    <th className="p-4 font-bold text-slate-600 text-xs uppercase text-right">Đơn giá</th>
                                    <th className="p-4 font-bold text-slate-600 text-xs uppercase text-right">Thành tiền</th>
                                    <th className="p-4 font-bold text-slate-600 text-xs uppercase text-center">Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {initialDetails.map((item: any) => (
                                    <tr 
                                        key={item.id} 
                                        onClick={() => {
                                            setItemForm({ id: item.id, id_product: item.id_product, quantity: item.quantity, price: item.price });
                                            setProductSearch(item.product_name);
                                        }} 
                                        className={`border-b cursor-pointer transition-colors ${itemForm.id === item.id ? "bg-blue-50" : "hover:bg-slate-50"}`}
                                    >
                                        <td className="p-4">
                                            <div className="font-bold text-slate-900 leading-tight">{item.product_name}</div>
                                            <div className="text-[10px] text-slate-400 font-mono mt-1 italic">Mã SP: {item.id_product}</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded text-xs">{item.quantity}</span>
                                        </td>
                                        <td className="p-4 text-right font-mono text-xs text-slate-500">
                                            {item.price.toLocaleString('vi-VN')}đ
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="font-black text-slate-800 text-sm">{(item.quantity * item.price).toLocaleString('vi-VN')}đ</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} 
                                                className="text-slate-300 hover:text-red-600 transition p-2"
                                            >
                                                <Trash2 size={16}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {initialDetails.length === 0 && (
                            <div className="p-20 text-center text-slate-400 italic text-sm">
                                Đơn hàng chưa có sản phẩm nào. Hãy thêm vào từ form bên trái.
                            </div>
                        )}
                    </div>
                    
                    {/* Ghi chú chân trang */}
                    <p className="mt-4 text-[10px] text-slate-400 italic">
                        * Mẹo: Nhấn vào một dòng trong bảng để chỉnh sửa nhanh số lượng hoặc đơn giá của sản phẩm đó.
                    </p>
                </div>
            </div>
        </div>
    );
}