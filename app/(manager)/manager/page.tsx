// app/dashboard/page.tsx
import { getEmployeeByUserId } from "@/app/actions/employeeAction";
import { getLeaveRequestsByEmployee } from "@/app/actions/leaveAction";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import DashboardInterface from "./DashboardInterface";

export default async function DashboardPage() {
    const user = await getCurrentUser()

    if (!user) {
        return <div className="p-10 text-center">Vui lòng đăng nhập để tiếp tục.</div>;
    }

    const employeeData = await getEmployeeByUserId(user.id);

    const leaveRequests = await getLeaveRequestsByEmployee(employeeData?.id || "");

    // Nếu fetch theo user.id chưa ra id_employee, ta lấy từ employeeData
    let finalLeaveRequests = leaveRequests;
    if (employeeData && !leaveRequests.length) {
        finalLeaveRequests = await getLeaveRequestsByEmployee(employeeData.id);
    }

    return (
        <DashboardInterface 
            employee={employeeData} 
            initialLeaveRequests={finalLeaveRequests} 
        />
    );
}