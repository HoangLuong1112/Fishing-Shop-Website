import { getOrders } from "@/app/actions/orderAction"
import OrderInterface from "./OrderInterface"

export interface Order {
    id: string
    id_user: string
    order_time: string
    receiver_name: string
    shipping_address: string
    phone: string
    status: string // approving, approved, shipping, success, cancelled
    total_price: number
}

export interface OrderDetail {
    id: string
    id_order: string
    id_product: string
    quantity: number
    price: number
    product_name: string //FK, đã có getProduct
}

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