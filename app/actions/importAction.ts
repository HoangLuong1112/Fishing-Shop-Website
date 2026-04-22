import { createClient } from "@/utils/supabase/client";
import { Import, ImportDetail } from "../utils/TypeGlobal";

export async function getImports() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("Import")
        .select(`
            id,
            id_supplier,
            id_employee,
            import_date,
            total_cost,
            note,
            Supplier (supplier_name),
            Employee (employee_name)
        `);

    if (error) {
        console.error("Error fetching imports:", error);
        return [];
    }

    return data.map((item: any) => ({
        ...item,
        supplier_name: item.Supplier?.supplier_name || "Không xác định",
        employee_name: item.Employee?.employee_name || "Không xác định"
    }));
}

export async function addImport(formData: Omit<Import, "id" | "supplier_name" | "employee_name">) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("Import")
        .insert([{
            id_supplier: formData.id_supplier,
            id_employee: formData.id_employee,
            import_date: formData.import_date,
            total_cost: formData.total_cost,
            note: formData.note,
        }])
        .select();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateImport(id: string, formData: Partial<Import>) {
    const supabase = await createClient();
    const { id: _id, supplier_name, employee_name, ...updateData } = formData;
    
    const { data, error } = await supabase
        .from("Import")
        .update(updateData)
        .eq("id", id)
        .select();

    if (error) throw new Error(error.message);
    return data;
}

async function updateImportTotalCost(id_import: string) {
    const supabase = await createClient();

    const { data: details, error: fetchError } = await supabase
        .from("ImportDetail")
        .select("quantity, import_price")
        .eq("id_import", id_import);

    if (fetchError) throw fetchError;

    const newTotal = details.reduce((sum, item) => {
        return sum + (Number(item.quantity) * Number(item.import_price));
    }, 0);

    const { error: updateError } = await supabase
        .from("Import")
        .update({ total_cost: newTotal })
        .eq("id", id_import);

    if (updateError) throw updateError;
}

export async function getImportDetails(id_import: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("ImportDetail")
        .select(`
            id,
            id_import,
            id_product,
            quantity,
            import_price,
            Product (product_name)
        `)
        .eq("id_import", id_import);

    if (error) {
        console.error("Error fetching import details:", error);
        return [];
    }

    return data.map((item: any) => ({
        ...item,
        product_name: item.Product?.product_name || "Không xác định"
    }));
}

export async function addImportDetail(formData: Omit<ImportDetail, "id" | "product_name">) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("ImportDetail")
        .insert([{
            id_import: formData.id_import,
            id_product: formData.id_product,
            quantity: formData.quantity,
            import_price: formData.import_price,
        }])
        .select();

    if (error) throw new Error(error.message);

    await updateImportTotalCost(formData.id_import);

    return data;
}

export async function updateImportDetail(id: string, formData: Partial<ImportDetail>) {
    const supabase = await createClient();
    const { id: _id, product_name, ...updateData } = formData;
    
    const { data, error } = await supabase
        .from("ImportDetail")
        .update(updateData)
        .eq("id", id)
        .select()
        .single(); // Lấy ra dòng vừa sửa để biết id_import

    if (error) throw new Error(error.message);

    if (data.id_import) {
        await updateImportTotalCost(data.id_import);
    }

    return data;
}

export async function deleteImportDetail(id: string) {
    const supabase = await createClient();

    const { data: detail } = await supabase
        .from("ImportDetail")
        .select("id_import")
        .eq("id", id)
        .single();

    const { error } = await supabase
        .from("ImportDetail")
        .delete()
        .eq("id", id)

    if (error) throw new Error(error.message);

    if (detail?.id_import) {
        await updateImportTotalCost(detail.id_import);
    }

    return true;
}