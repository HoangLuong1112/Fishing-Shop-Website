import { getEmployees } from "@/app/actions/employeeAction";
import EmployeeInterface, { Employee } from "./EmployeeInterface";

const MOCK_DATA: Employee[] = [];

export default async function HumanResourcesPage() {
    let employees: Employee[] = [];
    
    try {
        const data = await getEmployees();
        console.log("Employees:", data);
        if (!data || data.length === 0) {
            employees = MOCK_DATA;
        } else {
            employees = data;
        }   
    } catch (error) {
        console.error("Fetch error, using mock:", error);
        employees = MOCK_DATA;
    }

    return <EmployeeInterface initialData={employees} />;
}