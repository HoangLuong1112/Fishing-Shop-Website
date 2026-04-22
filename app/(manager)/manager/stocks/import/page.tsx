import { getImports } from "@/app/actions/importAction";
import ImportInterface from "./ImportInterface";
import { getSuppliers } from "@/app/actions/supplierAction";
import { getEmployees } from "@/app/actions/employeeAction";

export default async function Page() {
    const [imports, suppliers, employees] = await Promise.all([
        getImports(),
        getSuppliers(),
        getEmployees()
    ]);

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 uppercase">Quản lý nhập kho</h1>
                <p className="text-slate-500">Lịch sử nhập hàng và quản lý hóa đơn từ nhà cung cấp.</p>
            </div>
            <ImportInterface 
                initialData={imports} 
                suppliers={suppliers} 
                employees={employees} 
            />
        </div>
    );
}