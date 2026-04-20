import { createClient } from "@/utils/supabase/client";
import { Supplier } from "../(manager)/manager/stocks/supplier/page";

export async function getSuppliers() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("Supplier")
        .select(`
            id,
            supplier_name,
            phone,
            email,
            address
        `);

    if (error) {
        console.error("Error fetching positions:", error);
        return [];
    }

    return data;
}

// Thêm nhà cung cấp
export async function addSupplier(formData: Omit<Supplier, "id">) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("Supplier")
        .insert([{
            supplier_name: formData.supplier_name,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
        }])
        .select();

    if (error) throw new Error(error.message);
    return data;
}

// Cập nhật nhà cung cấp
export async function updateSupplier(id: string, formData: Partial<Supplier>) {
    const supabase = await createClient();
    const { id: _id, ...updateData } = formData;
    const { data, error } = await supabase
        .from("Supplier")
        .update(updateData)
        .eq("id", id)
        .select();

    if (error) throw new Error(error.message);
    return data;
}

// Xóa nhà cung cấp
export async function deleteSupplier(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("Supplier")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);
    return true;
}
