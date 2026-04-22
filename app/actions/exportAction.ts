import { createClient } from "@/utils/supabase/client";
import { Export } from "../utils/TypeGlobal";

export async function getExports() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("Export")
        .select(`
            id,
            id_employee,
            id_order,
            export_date,
            note,
            Employee (employee_name)
        `)
        .order('export_date', { ascending: false });

    if (error) {
        console.error("Error fetching exports:", error);
        return [];
    }

    return data.map((item: any) => ({
        ...item,
        employee_name: item.Employee?.employee_name || "Không xác định"
    }));
}

export async function addExport(formData: Omit<Export, "id">) {
    const supabase = await createClient();
    
    const { data, error } = await supabase
        .from("Export")
        .insert([{
            id_employee: formData.id_employee,
            id_order: formData.id_order,
            export_date: formData.export_date,
            note: formData.note,
        }])
        .select();

    if (error) throw new Error(error.message);
    
    await supabase.from("Order").update({ status: 'shipping' }).eq("id", formData.id_order);
    
    await decreaseStockFromOrder(formData.id_order);

    return data;
}

export async function updateExport(id: string, formData: Partial<Export>) {
    const supabase = await createClient();
    
    // bỏ id và employee_name khỏi dữ liệu cập nhật
    const { id: _id, ...updateData } = formData;
    
    const { data, error } = await supabase
        .from("Export")
        .update(updateData)
        .eq("id", id)
        .select();

    if (error) throw new Error(error.message);
    return data;
}

export async function decreaseStockFromOrder(id_order: string) {
    const supabase = await createClient();

    try {
        // 1. Lấy danh sách sản phẩm trong đơn hàng
        const { data: items, error: itemError } = await supabase
            .from("OrderItems")
            .select("id_product, quantity")
            .eq("id_order", id_order);

        if (itemError) throw itemError;

        // 2. Loop từng item để update stock
        for (const item of items) {
            // Lấy stock hiện tại
            const { data: product, error: productError } = await supabase
                .from("Product")
                .select("stock_quantity")
                .eq("id", item.id_product)
                .single();

            if (productError) throw productError;

            const newStock = product.stock_quantity - item.quantity;

            // 3. Update lại stock
            const { error: updateError } = await supabase
                .from("Product")
                .update({
                    stock_quantity: newStock < 0 ? 0 : newStock
                })
                .eq("id", item.id_product);

            if (updateError) throw updateError;
        }

        return { success: true };

    } catch (error: any) {
        console.error("Decrease stock error:", error.message);
        return { success: false, error: error.message };
    }
}