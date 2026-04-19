"use client";

import { useState } from "react";
import { addProduct, updateProduct } from "@/app/actions/productAction";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

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

    const [newImage, setNewImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState(
        initialData?.image_url || ""
    );

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        try {
            const supabase = createClient();
            let imageUrl = form.image_url;
            if (newImage) { // ảnh mới
                const fileExt = newImage.name.split(".").pop() || "png";
                const fileName = `products/${initialData?.id}-${Date.now()}.${fileExt}`;

                // validate
                if (newImage.size > 2 * 1024 * 1024) {
                    toast.error("Ảnh tối đa 2MB");
                    return;
                }

                if (!newImage.type.startsWith("image/")) {
                    toast.error("Chỉ được upload ảnh");
                    return;
                }

                // upload
                const { error: uploadError } = await supabase.storage
                    .from("main")
                    .upload(fileName, newImage);

                if (uploadError) throw uploadError;

                // lấy public url
                const { data } = supabase.storage
                    .from("main")
                    .getPublicUrl(fileName);

                const newUrl = data.publicUrl;

                // xóa ảnh cũ nếu edit
                if (isEdit && form.image_url) {
                    console.log("OLD URL:", form.image_url);
                    const oldPath = form.image_url
                        ?.split("/storage/v1/object/public/main/")[1]
                        ?.split("?")[0];
                    console.log("OLD URL:", imageUrl);
                    console.log("OLD PATH:", oldPath);

                    if (oldPath) {
                        await supabase.storage.from("main").remove([oldPath]);
                    }
                }

                imageUrl = newUrl;
            }

            const payload = {
                ...form,
                image_url: imageUrl,
            };

            if (isEdit) {
                await updateProduct(initialData.id, payload);
            } else {
                await addProduct(payload);
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

            {/* <input name="image_url" value={form.image_url} onChange={handleChange} placeholder="Ảnh URL" className="w-full border p-2 rounded" /> */}
            <div className="flex items-center gap-4">
                <p className="font-bold text-lg">Ảnh sản phẩm</p>

                <div className="relative group w-24 h-24">
                    <img
                        src={previewImage || "/image/default.png"}
                        className="w-24 h-24 object-cover rounded border"
                    />

                    {/* overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded transition">
                        <button
                            type="button"
                            onClick={() => document.getElementById("productImageInput")?.click()}
                            className="bg-white p-2 rounded-full"
                        >
                            📷
                        </button>
                    </div>

                    <input
                        id="productImageInput"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                </div>
            </div>

            <select
                name="id_category"
                value={form.id_category}
                onChange={handleChange}
                className="w-full border border-black p-2 rounded"
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