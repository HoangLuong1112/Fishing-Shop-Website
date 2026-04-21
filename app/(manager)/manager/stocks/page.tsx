import { getUnapprovedOrders } from "@/app/actions/orderAction";
import StocksDashboard from "./StockDashboard";

export default async function Page() {
    const unapprovedOrders = await getUnapprovedOrders();

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 uppercase">Dashboard đơn hàng/kho</h1>
                <p className="text-slate-500">Truy cập các danh mục và phê duyệt đơn hàng chờ.</p>
            </div>
            
            <StocksDashboard initialOrders={unapprovedOrders} />
        </div>
    );
}