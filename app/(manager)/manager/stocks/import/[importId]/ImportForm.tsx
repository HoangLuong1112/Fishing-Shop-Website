"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus, Save, Trash2, ArrowLeft, Package, ShoppingCart, Info } from "lucide-react";
import { addImportDetail, updateImportDetail, deleteImportDetail } from "@/app/actions/importAction";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ImportForm({ importInfo, initialDetails, products }: any) {
    const router = useRouter();
    const [details, setDetails] = useState(initialDetails);
    const [loading, setLoading] = useState(false);
    
    // Form nhập sản phẩm mới
    const [itemForm, setItemForm] = useState({ id: "", id_product: "", quantity: 1, import_price: 0 });
    const [productSearch, setProductSearch] = useState("");

    // Tìm kiếm sản phẩm thông minh
    const productOptions = useMemo(() => {
        if (!productSearch) return [];
        return products.filter((p: any) => 
            p.product_name.toLowerCase().includes(productSearch.toLowerCase()) ||
            String(p.id).includes(productSearch)
        ).slice(0, 5);
    }, [products, productSearch]);

    const handleAddItem = async (e: any) => {
        e.preventDefault();
        if (!itemForm.id_product) return toast.error("Vui lòng chọn sản phẩm");
        setLoading(true);
        try {
            const payload = { ...itemForm, id_import: importInfo.id };
            if (itemForm.id) {
                await updateImportDetail(itemForm.id, payload);
                toast.success("Đã cập nhật chi tiết");
            } else {
                await addImportDetail(payload);
                toast.success("Đã thêm sản phẩm vào phiếu");
            }
            setItemForm({ id: "", id_product: "", quantity: 1, import_price: 0 });
            setProductSearch("");
            router.refresh();
        } catch (err: any) { toast.error(err.message); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id: string) => {
        try {
            if (!confirm("Xóa sản phẩm này khỏi phiếu?")) return;
            await deleteImportDetail(id);
            toast.success("Đã xóa chi tiết");
            router.refresh();
        } catch (err: any) { toast.error(err.message); }
        finally { setLoading(false); }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
                <Link href="/manager/stocks/import" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition font-bold">
                    <ArrowLeft size={20}/> QUAY LẠI
                </Link>
                <div className="text-right font-black text-2xl text-emerald-600">
                    TỔNG: {importInfo.total_cost.toLocaleString('vi-VN')}đ
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form thêm sản phẩm (Giống style SupplierInterface) */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                        <div className="bg-slate-900 p-4 text-white text-xs font-bold uppercase tracking-widest">
                            {itemForm.id ? "Sửa chi tiết" : "Thêm sản phẩm nhập"}
                        </div>
                        <form onSubmit={handleAddItem} className="p-6 space-y-4">
                            <div className="relative">
                                <label className="text-xs font-bold text-slate-500 uppercase">Tìm sản phẩm</label>
                                <input 
                                    type="text" 
                                    placeholder="Gõ tên hoặc mã SP..." 
                                    value={productSearch}
                                    onChange={e => setProductSearch(e.target.value)}
                                    className="w-full border p-2 rounded-lg mt-1 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {productOptions.length > 0 && (
                                    <div className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow-xl overflow-hidden">
                                        {productOptions.map((p: any) => (
                                            <div key={p.id} onClick={() => {
                                                setItemForm({...itemForm, id_product: p.id, import_price: p.price});
                                                setProductSearch(p.product_name);
                                            }} className="p-2 hover:bg-slate-50 cursor-pointer flex justify-between border-b last:border-0">
                                                <span className="text-sm font-medium">{p.product_name}</span>
                                                <span className="text-xs text-slate-400">#{p.id}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Số lượng</label>
                                    <input type="number" min="1" value={itemForm.quantity} onChange={e => setItemForm({...itemForm, quantity: Number(e.target.value)})} className="w-full border p-2 rounded-lg mt-1" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Giá nhập</label>
                                    <input type="number" value={itemForm.import_price} onChange={e => setItemForm({...itemForm, import_price: Number(e.target.value)})} className="w-full border p-2 rounded-lg mt-1 text-emerald-600 font-bold" />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-black flex items-center justify-center gap-2 hover:bg-blue-700 transition uppercase tracking-tighter">
                                <Plus size={20}/> {itemForm.id ? "Cập nhật dòng" : "Thêm vào bảng"}
                            </button>
                            <Link href="/manager/products/new" className="block text-center text-xs font-bold text-slate-400 hover:text-blue-600 transition underline">
                                Không có sản phẩm? Thêm sản phẩm mới
                            </Link>
                        </form>
                    </div>

                    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-3">
                        <h3 className="text-xs font-black text-slate-400 uppercase flex items-center gap-2"><Info size={14}/> Thông tin phiếu</h3>
                        <p className="text-sm"><strong>NCC:</strong> {importInfo.supplier_name}</p>
                        <p className="text-sm"><strong>NV:</strong> {importInfo.employee_name}</p>
                        <p className="text-sm"><strong>Ngày:</strong> {new Date(importInfo.import_date).toLocaleString('vi-VN')}</p>
                        {importInfo.note && <div className="p-3 bg-slate-50 rounded italic text-xs text-slate-500">"{importInfo.note}"</div>}
                    </div>
                </div>

                {/* Bảng chi tiết sản phẩm đã nhập */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="p-4 font-semibold text-slate-700">Sản phẩm</th>
                                    <th className="p-4 font-semibold text-slate-700 text-center">SL</th>
                                    <th className="p-4 font-semibold text-slate-700 text-right">Giá nhập</th>
                                    <th className="p-4 font-semibold text-slate-700 text-right">Thành tiền</th>
                                    <th className="p-4 font-semibold text-slate-700 text-center">Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {initialDetails.map((item: any) => (
                                    <tr key={item.id} onClick={() => {
                                        setItemForm({ id: item.id, id_product: item.id_product, quantity: item.quantity, import_price: item.import_price });
                                        setProductSearch(item.product_name);
                                    }} className="border-b hover:bg-blue-50 cursor-pointer group">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-900">{item.product_name}</div>
                                            <div className="text-[10px] text-slate-400 font-mono">ID_PROD: {item.id_product}</div>
                                        </td>
                                        <td className="p-4 text-center font-medium">{item.quantity}</td>
                                        <td className="p-4 text-right font-mono text-xs">{item.import_price.toLocaleString('vi-VN')}đ</td>
                                        <td className="p-4 text-right font-black text-slate-700">{(item.quantity * item.import_price).toLocaleString('vi-VN')}đ</td>
                                        <td className="p-4 text-center">
                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="text-red-300 hover:text-red-600 transition p-2">
                                                <Trash2 size={16}/>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {initialDetails.length === 0 && <div className="p-20 text-center text-slate-400 italic">Phiếu nhập trống</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}