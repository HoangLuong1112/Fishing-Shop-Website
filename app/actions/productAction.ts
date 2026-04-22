import { createClient } from "@/utils/supabase/client";
import { Product } from "../utils/TypeGlobal";

export async function getCategories() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("Category")
        .select(`
            id,
            category_name
        `);

    if (error) {
        console.error("Error fetching categories:", error);
        return [];
    }

    return data;
}

/*Lấy danh sách sản phẩm kèm tên danh mục*/
export async function getProducts(): Promise<Product[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("Product")
        .select(`
            id,
            id_category,
            product_name:product_name,
            description,
            price,
            stock_quantity,
            image_url,
            status,
            Category (
                category_name
            )
        `);
        

    if (error) {
        console.error("Error fetching products:", error);
        return [];
    }

    // console.log("Fetched products with categories:", data);

    return (data as any[]).map((item) => ({
        id: item.id,
        id_category: item.id_category,
        product_name: item.product_name,
        description: item.description,
        price: item.price,
        stock_quantity: item.stock_quantity,
        image_url: item.image_url,
        status: item.status,
        category_name: item.Category?.category_name || "Không xác định",
    }));
}

//  Thêm sản phẩm mới
export async function addProduct(formData: Omit<Product, "id" | "category_name">) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("Product")
        .insert([
            {
                id_category: formData.id_category,
                product_name: formData.product_name,
                description: formData.description,
                price: formData.price,
                stock_quantity: formData.stock_quantity,
                image_url: formData.image_url,
                status: formData.status,
            },
        ]).select();

    if (error) throw new Error(error.message);
    
    return data;
}

//  Sửa thông tin sản phẩm
export async function updateProduct(id: string, formData: Partial<Product>) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("Product")
        .update({
            product_name: formData.product_name,
            description: formData.description,
            price: formData.price,
            stock_quantity: formData.stock_quantity,
            image_url: formData.image_url,
            status: formData.status,
        })
        .eq("id", id).select();

    if (error) throw new Error(error.message);

    return data;
}
