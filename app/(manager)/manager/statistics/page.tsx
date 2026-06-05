import { getEmployees } from "@/app/actions/employeeAction";
import { getAllSalaryHistory, getSalaryHistory } from "@/app/actions/salaryAction";
import { getProducts } from "@/app/actions/productAction";
import { getOrders } from "@/app/actions/orderAction"; // Giả định bạn đã có hàm này
import { getImports } from "@/app/actions/importAction"; // Giả định bạn đã có hàm này
import StatisticsInterface from "./StatisticsInterface";

export default async function AnalyticsPage() {
    // Fetch toàn bộ data để tính toán thống kê
    const [employees, salaries, products, orders, imports] = await Promise.all([
        getEmployees(),
        getAllSalaryHistory(), // Cần chỉnh sửa action để lấy toàn bộ nếu truyền "all"
        getProducts(),
        getOrders(), 
        getImports()
    ]);

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">
                
                <StatisticsInterface 
                    employees={employees}
                    salaries={salaries}
                    products={products}
                    orders={orders}
                    imports={imports}
                />
            </div>
        </div>
    );
}