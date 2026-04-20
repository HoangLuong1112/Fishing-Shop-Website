import { getDepartments, getEmployees, getPositions } from "@/app/actions/employeeAction";
import EmployeeForm from "./EmployeeForm";

interface Props {
    params: { employeeId: string };
}

export default async function EmployeeDetailPage({ params }: Props) {
    const { employeeId } = await params

    const departments = await getDepartments()
    const positions = await getPositions()

    if (employeeId === "new") {
        return (
            <div className="p-6">
                <h1 className="text-4xl font-bold mb-10">Thêm Nhân viên</h1>
                <EmployeeForm departments={departments} positions={positions} />
            </div>
        );
    }

    const employees = await getEmployees();
    const employee = employees.find(e => String(e.id) === employeeId);

    if (!employee) {
        return <div className="p-6">Không tìm thấy nhân viên</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold mb-10">Sửa sản phẩm</h1>
            <EmployeeForm initialData={employee} departments={departments} positions={positions} isEdit />
        </div>
    );
}