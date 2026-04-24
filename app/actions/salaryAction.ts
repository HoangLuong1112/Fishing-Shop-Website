import { createClient } from "@/utils/supabase/client";
import { Salary, SalaryDetail } from "../utils/TypeGlobal";

// danh sách lương của 1 nhân viên
export async function getSalaryHistory(employeeId: string): Promise<Salary[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("Salary")
        .select(`
            *,
            Employee (employee_name)
        `)
        .eq("id_employee", employeeId)
        .order("year", { ascending: false })
        .order("month", { ascending: false });

    if (error) return [];
    return (data as any[]).map(item => ({
        ...item,
        employee_name: item.Employee?.employee_name || "N/A"
    }));
}

export async function getAllSalaryHistory(): Promise<Salary[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("Salary")
        .select(`
            *,
            Employee (employee_name)
        `)
        .order("year", { ascending: false })
        .order("month", { ascending: false });

    if (error) return [];
    return (data as any[]).map(item => ({
        ...item,
        employee_name: item.Employee?.employee_name || "N/A"
    }));
}

// chi tiết lương của 1 bảng lương
export async function getSalaryDetails(salaryId: string): Promise<SalaryDetail[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("SalaryDetail")
        .select("*")
        .eq("id_salary", salaryId);

    if (error) return [];
    return data;
}

// tính tổng từ các SalaryDetail và cập nhật vào Salary.
export async function recalculateFinalSalary(salaryId: string) {
    const supabase = await createClient();

    // 1. Lấy tất cả details của lương này
    const { data: details, error: fetchError } = await supabase
        .from("SalaryDetail")
        .select("detail_calculation, amount")
        .eq("id_salary", salaryId);

    if (fetchError) throw fetchError;

    // 2. Tính toán
    const finalSalary = details.reduce((acc, item) => {
        if (item.detail_calculation === "add") return acc + Number(item.amount);
        if (item.detail_calculation === "sub") return acc - Number(item.amount);
        return acc;
    }, 0);

    // 3. Cập nhật lại vào bảng Salary
    const { error: updateError } = await supabase
        .from("Salary")
        .update({ final_salary: finalSalary })
        .eq("id", salaryId);

    if (updateError) throw updateError;
    return finalSalary;
}

// Khởi tạo hoặc Lấy thông tin lương
export async function getOrCreateSalary(employeeId: string, month: number, year: number, user: any) {
    const supabase = await createClient();
    console.log("user in: ", user)

    // 1. Kiểm tra xem đã có bản ghi lương chưa
    const { data: existingSalary } = await supabase
        .from("Salary")
        .select(`*, SalaryDetail(*)`)
        .eq("id_employee", employeeId)
        .eq("month", month)
        .eq("year", year)
        .single();

    // console.log("Existing salary data:", existingSalary);

    if (existingSalary) {
        // Nếu đã có, tính toán lại phát nữa cho chắc rồi trả về
        await recalculateFinalSalary(existingSalary.id);
        return existingSalary;
    }

    // 2. NẾU CHƯA CÓ: Bắt đầu khởi tạo mặc định
    // Tạo Header Salary trước
    console.log("Checking if Salary record exists for employee:", employeeId, "Month:", month, "Year:", year);
    const { data: newSalary, error: sError } = await supabase
        .from("Salary")
        .insert([{ id_employee: employeeId, month: month as number,year: year as number, final_salary: 0 }])
        .select().single();
    
    console.log("Created new Salary record:", newSalary);

    if (sError) throw sError;

    // Lấy thông tin Base Salary từ Position
    const { data: emp } = await supabase
        .from("Employee")
        .select("id_position, Position(base_salary)")
        .eq("id", employeeId)
        .single();

    const baseSalary = emp?.Position[0]?.base_salary || 0;
    console.log("Base salary for employee:", baseSalary);

    // 3. Tạo các Detail mặc định
    const defaultDetails = [];
    
    // - Dòng Base Salary
    defaultDetails.push({
        id_salary: newSalary.id,
        detail: "Lương cơ bản",
        detail_calculation: "add",
        amount: baseSalary,
        note: "Lấy từ hệ thống"
    });

    // - Quét đơn nghỉ LeaveRequest
    const { data: leaves } = await supabase
        .from("LeaveRequest")
        .select("status, type, start_date")
        .eq("id_employee", employeeId);

    // Lọc đơn trong tháng/năm đang xét
    const leavesInMonth = leaves?.filter(l => {
        const d = new Date(l.start_date);
        return d.getMonth() + 1 === month && d.getFullYear() === year;
    }) || [];

    leavesInMonth.forEach((leaf, index) => {
        let penalty = 0;
        if (leaf.status === 'rejected') penalty = 200000;
        // logic: pending/approved = 0 (như bạn yêu cầu)
        
        defaultDetails.push({
            id_salary: newSalary.id,
            detail: `Nghỉ phép (${leaf.type}) - Đơn #${index + 1}`,
            detail_calculation: penalty > 0 ? "sub" : "none",
            amount: penalty,
            note: `Trạng thái: ${leaf.status}`
        });
    });

    // Lưu tất cả detail vào DB
    await supabase.from("SalaryDetail").insert(defaultDetails);

    // 4. Tính toán tổng lương lần đầu sau khi tạo
    const final = await recalculateFinalSalary(newSalary.id);
    
    return { ...newSalary, final_salary: final, SalaryDetail: defaultDetails };
}

// Lưu và cập nhập detail
export async function saveSalaryChanges(salaryId: string, details: SalaryDetail[]) {
    const supabase = await createClient();

    // 1. Xóa các detail cũ (để tránh trùng lặp hoặc xử lý logic update phức tạp)
    // Cách này nhanh và sạch nhất cho form tính toán
    const { error: deleteError } = await supabase
        .from("SalaryDetail")
        .delete()
        .eq("id_salary", salaryId);

    if (deleteError) throw deleteError;

    // 2. Chèn mớ detail mới từ giao diện vào
    const cleanDetails = details.map(({ id, ...rest }) => ({ ...rest, id_salary: salaryId }));
    const { error: insertError } = await supabase
        .from("SalaryDetail")
        .insert(cleanDetails);

    if (insertError) throw insertError;

    // 3. Tính toán lại final_salary ngay lập tức
    const newFinal = await recalculateFinalSalary(salaryId);

    return newFinal;
}