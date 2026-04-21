import { getEmployees } from "@/app/actions/employeeAction"
import { getExports } from "@/app/actions/exportAction"
import { getOrders } from "@/app/actions/orderAction"
import ExportInterface from "./ExportInterface"

export interface Export {
    id: string
    id_employee: string
    id_order: string
    export_date: string
    note: string
}

export default async function ExportPage() {
    const [exports, orders, employees] = await Promise.all([
        getExports(),
        getOrders(),
        getEmployees()
    ]);

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 uppercase">Quản lý xuất hàng</h1>
                <p className="text-slate-500">Lịch sử xuất hàng đơn xuất hàng</p>
            </div>
            <ExportInterface 
                initialData={exports} 
                employees={employees} 
                orders={orders} 
            />
        </div>
    );
}