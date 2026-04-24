// app/dashboard/salary/page.tsx
import { getSalaryHistory } from "@/app/actions/salaryAction";
import UserSalaryInterface from "./UserSalaryInterface";
import { getCurrentEmployee } from "@/app/actions/getCurrentUser";

export default async function UserSalaryPage() {
    const employee = await getCurrentEmployee();

    if (!employee) {
        return <div className="p-10 text-center">Không tìm thấy thông tin nhân viên.</div>;
    }

    // Lấy toàn bộ lịch sử lương của nhân viên này
    const salaryHistory = await getSalaryHistory(employee.id);

    return (
        <UserSalaryInterface 
            employee={employee} 
            salaryHistory={salaryHistory} 
        />
    );
}