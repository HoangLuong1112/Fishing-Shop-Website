import { getEmployeeByUserId, getEmployees } from "@/app/actions/employeeAction";
import EmployeeInterface from "./EmployeeInterface";
import { Employee, LeaveRequest } from "@/app/utils/TypeGlobal";
import { getLeaveRequests } from "@/app/actions/leaveAction";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

const MOCK_DATA: Employee[] = [];

export default async function HumanResourcesPage() {
    let employees: Employee[] = [];
    let leaveRequests: LeaveRequest[] = [];
    let currentEmployee: Employee | null = null;
    
    try {
        const data = await getEmployees();
        console.log("Employees:", data);
        if (!data || data.length === 0) {
            employees = MOCK_DATA;
        } else {
            employees = data;
        }   

        const leaveData = await getLeaveRequests()
        leaveRequests = leaveData || [];

        const user = await getCurrentUser()
        const employeeData = await getEmployeeByUserId(user?.id || "");
        currentEmployee = employeeData || null;
    } catch (error) {
        console.error("Fetch error, using mock:", error);
        employees = MOCK_DATA;
    }

    return <EmployeeInterface initialData={employees} initialLeaveRequests={leaveRequests} currentEmployee={currentEmployee}/>;
}