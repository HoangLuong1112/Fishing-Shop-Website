import { createClient } from "@/utils/supabase/client";
import { LeaveRequest } from "../utils/TypeGlobal";

export async function getLeaveRequests(): Promise<LeaveRequest[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("LeaveRequest")
        .select(`
            *,
            employee:id_employee (employee_name),
            approver:approved_by (employee_name)
        `)
        .order("id", { ascending: false });

    if (error) {
        console.error("Error fetching leave requests:", error);
        return [];
    }

    return (data as any[]).map((item) => ({
        ...item,
        employee_name: item.employee?.employee_name || "N/A",
        approver_name: item.approver?.employee_name || "Chưa duyệt",
    }));
}

export async function getLeaveRequestsByEmployee(employeeId: string): Promise<LeaveRequest[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("LeaveRequest")
        .select(`
            *,
            employee:id_employee (employee_name),
            approver:approved_by (employee_name)
        `)
        .eq("id_employee", employeeId)
        .order("id", { ascending: false });

    if (error) {
        console.error("Error fetching employee leave requests:", error);
        return [];
    }

    return (data as any[]).map((item) => ({
        ...item,
        employee_name: item.employee?.employee_name || "N/A",
        approver_name: item.approver?.employee_name || "Chưa duyệt",
    }));
}

export async function addLeaveRequest(
    formData: Omit<LeaveRequest, "id" | "employee_name" | "approver_name" | "status" | "approved_by">
) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("LeaveRequest")
        .insert([
            {
                id_employee: formData.id_employee,
                type: formData.type,
                start_date: formData.start_date,
                end_date: formData.end_date,
                reason: formData.reason,
                status: "pending", // Mặc định khi tạo mới
            },
        ])
        .select();

    if (error) {
        console.error("Error adding leave request:", error);
        throw new Error(error.message);
    }
    return data;
}

export async function updateLeaveStatus(
    requestId: string,
    approverId: string,
    status: "approved" | "rejected"
) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("LeaveRequest")
        .update({
            status: status,
            approved_by: approverId,
        })
        .eq("id", requestId)
        .select();

    if (error) {
        console.error("Error updating leave status:", error);
        throw new Error(error.message);
    }
    return data;
}