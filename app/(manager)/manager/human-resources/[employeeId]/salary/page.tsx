// app/dashboard/salary/page.tsx
import { getSalaryHistory } from "@/app/actions/salaryAction";
import MySalaryInterface from "./SalaryInterface";
import { getCurrentEmployee } from "@/app/actions/getCurrentUser";
import { getEmployeeByEmployeeId, getEmployeeByUserId } from "@/app/actions/employeeAction";

export default async function MySalaryPage({ params }: { params: { employeeId: string } }) {
    const { employeeId } = await params;
    // const employee = await getCurrentEmployee();
    const employee = await getEmployeeByEmployeeId(employeeId);

    if (!employee) {
        return <div className="p-10 text-center">Không tìm thấy thông tin nhân viên.</div>;
    }

    // Lấy toàn bộ lịch sử lương của nhân viên này
    const salaryHistory = await getSalaryHistory(employee.id);

    return (
        <MySalaryInterface 
            employee={employee} 
            salaryHistory={salaryHistory} 
        />
    );
}