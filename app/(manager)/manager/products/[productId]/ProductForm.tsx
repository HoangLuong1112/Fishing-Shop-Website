"use client";

import { useState } from "react";
import { addProduct, updateProduct } from "@/app/actions/productAction";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProductForm({ initialData, categories =[], isEdit }: any) {
    const router = useRouter();

    const [form, setForm] = useState({
        product_name: initialData?.product_name || "",
        description: initialData?.description || "",
        price: initialData?.price || 0,
        stock_quantity: initialData?.stock_quantity || 0,
        image_url: initialData?.image_url || "",
        status: initialData?.status ?? true,
        id_category: initialData?.id_category || "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;

        setForm(prev => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : name === "price" || name === "stock_quantity"
                    ? Number(value)
                    : value
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEdit) {
                await updateProduct(initialData.id, form);
            } else {
                await addProduct(form);
            }

            router.push("/manager/products");
            router.refresh();
            toast.success(`Sản phẩm đã được ${isEdit ? "cập nhật" : "thêm"} thành công!`);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
            
            <div className="flex items-center gap-4">
                <p className="whitespace-nowrap font-bold text-lg">Tên sản phẩm</p>
                <input name="product_name" value={form.product_name} onChange={handleChange} placeholder="Tên sản phẩm" className="w-full border border-black p-2 rounded" />
            </div>

            <div className="flex items-center gap-4">
                <p className="whitespace-nowrap font-bold text-lg">Mô tả</p>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Mô tả" className="w-full border border-black p-2 rounded" />
            </div>

            <div className="flex items-center gap-4">
                <p className="whitespace-nowrap font-bold text-lg">Giá</p>
                <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Giá" className="w-full border border-black p-2 rounded" />
            </div>

            <div className="flex items-center gap-4">
                <p className="whitespace-nowrap font-bold text-lg">Số lượng trong kho</p>
                <input type="number" name="stock_quantity" value={form.stock_quantity} onChange={handleChange} placeholder="Kho" className="w-full border border-black p-2 rounded" />
            </div>

            <input name="image_url" value={form.image_url} onChange={handleChange} placeholder="Ảnh URL" className="w-full border p-2 rounded" />

            <select
                name="id_category"
                value={form.id_category}
                onChange={handleChange}
                className="w-full border p-2 rounded"
            >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((c: any) => (
                    <option key={c.id} value={c.id}>
                        {c.category_name}
                    </option>
                ))}
            </select>

            <label className="flex gap-2 items-center">
                <input type="checkbox" name="status" checked={form.status} onChange={handleChange} />
                Đang bán
            </label>

            <button className="bg-blue-600 text-white px-4 py-2 rounded">
                {loading ? "Đang lưu..." : isEdit ? "Cập nhật" : "Thêm"}
            </button>
        </form>
    );
}