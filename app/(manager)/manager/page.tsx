// app/dashboard/page.tsx
import { getEmployeeByUserId } from "@/app/actions/employeeAction";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import DashboardInterface from "./DashboardInterface";

export default async function DashboardPage() {
    const user = await getCurrentUser()

    if (!user) {
        return <div className="p-10 text-center">Vui lòng đăng nhập để tiếp tục.</div>;
    }

    const employeeData = await getEmployeeByUserId(user.id);

    return (
        <DashboardInterface 
            employee={employeeData} 
        />
    );
}