import { createClient } from "@/utils/supabase/client";
import { Product } from "../utils/TypeGlobal";

export async function getSaleProducts(): Promise<Product[]> {
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
        `).eq("status", true).order("created_at", { ascending: false });
    if (error) {
        console.error("Error fetching products:", error);
        return [];
    }

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

export async function getProduct(id: string): Promise<Product[]> {
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
        `).eq("id", id)

    if (error) {
        console.error("Error fetching products:", error);
        return [];
    }

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

export async function getOrderHistory(userId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("Order")
        .select(`
            *,
            OrderItems (
                quantity,
                item_price,
                Product (
                    product_name,
                    image_url
                )
            )
        `)
        .eq("id_user", userId)
        .order("order_time", { ascending: false });

    if (error) {
        console.error("Error fetching orders:", error);
        return [];
    }

    return data;
}