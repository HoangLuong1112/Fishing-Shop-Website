import { createClient } from "@/utils/supabase/client";
import { Export } from "../(manager)/manager/stocks/export/page";

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

    return data;
}

export async function updateExport(id: string, formData: Partial<Export>) {
    const supabase = await createClient();
    
    // Loại bỏ id và employee_name khỏi dữ liệu cập nhật
    const { id: _id, ...updateData } = formData;
    
    const { data, error } = await supabase
        .from("Export")
        .update(updateData)
        .eq("id", id)
        .select();

    if (error) throw new Error(error.message);
    return data;
}