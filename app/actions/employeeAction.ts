import { createClient } from "@/utils/supabase/client";
import { Employee } from "../utils/TypeGlobal";

export async function getDepartments() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("Department")
        .select(`
            id,
            department_name
        `);

    if (error) {
        console.error("Error fetching departments:", error);
        return [];
    }

    return data;
}

export async function getPositions() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("Position")
        .select(`
            id,
            position_name,
            base_salary
        `);

    if (error) {
        console.error("Error fetching positions:", error);
        return [];
    }

    return data;
}

export async function getEmployees(): Promise<Employee []> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from("Employee")
        .select(`
            id,
            id_user,
            id_department,
            id_position,
            employee_name,
            profile_picture,
            birthday,
            gender,
            cic,
            tax_id,
            marital_status,
            address_p,
            address_c,
            phone,
            email,
            hired_date,
            status,
            Department (
                department_name
            ),
            Position (
                position_name,
                base_salary
            )`);
        

    if (error) {
        console.error("Error fetching employees:", error);
        return [];
    }

    return (data as any[]).map((item) => ({
        id: item.id,
        id_user: item.id_user,
        id_department: item.id_department,
        id_position: item.id_position,
        employee_name: item.employee_name,
        profile_picture: item.profile_picture,
        birthday: item.birthday,
        gender: item.gender,
        cic: item.cic,
        tax_id: item.tax_id,
        marital_status: item.marital_status,
        address_p: item.address_p,
        address_c: item.address_c,
        phone: item.phone,
        email: item.email,
        hired_date: item.hired_date,
        status: item.status,
        department_name: item.Department?.department_name || "Không xác định",
        position_name: item.Position?.position_name || "Không xác định",
        base_salary: item.Position?.base_salary || 0,
    }));
}

export async function addEmployee(formData: Omit<Employee, "id" | "department_name" | "position_name" | "base_salary">) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("Employee")
        .insert([
            {
                id_user: formData.id_user,
                id_department: formData.id_department,
                id_position: formData.id_position,
                employee_name: formData.employee_name,
                profile_picture: formData.profile_picture,
                birthday: formData.birthday,
                gender: formData.gender,
                cic: formData.cic,
                tax_id: formData.tax_id,
                marital_status: formData.marital_status,
                address_p: formData.address_p,
                address_c: formData.address_c,
                phone: formData.phone,
                email: formData.email,
                hired_date: formData.hired_date,
                status: formData.status,
            },
        ]).select();

    if (error) throw new Error(error.message);
    return data;
}

export async function updateEmployee(id: string, formData: Partial<Employee>) {
    const supabase = await createClient();

    const { department_name, position_name, base_salary, id: _id, ...updateData } = formData as any;

    const { data, error } = await supabase
        .from("Employee")
        .update(updateData)
        .eq("id", id)
        .select();

    if (error) throw new Error(error.message);
    return data;
}

export async function getEmployeeByUserId(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("Employee")
        .select(`
            *,
            Department(department_name),
            Position(position_name, base_salary)
        `)
        .eq("id_user", userId)
        .single();

    if (error) return null;
    return data;
}

export async function getEmployeeByEmployeeId(employeeId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("Employee")
        .select(`
            *,
            Department(department_name),
            Position(position_name, base_salary)
        `)
        .eq("id", employeeId)
        .single();

    if (error) return null;
    return data;
}