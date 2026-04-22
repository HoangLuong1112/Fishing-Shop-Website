import { getOrders } from "@/app/actions/orderAction"
import OrderInterface from "./OrderInterface"

export default async function OrderPage() {
    const orders = await getOrders();

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 uppercase">Quản lý đơn hàng</h1>
                <p className="text-slate-500">Theo dõi, duyệt đơn và quản lý trạng thái vận chuyển khách hàng.</p>
            </div>
            <OrderInterface initialData={orders} />
        </div>
    );
}