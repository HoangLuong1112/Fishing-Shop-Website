import { getOrders, getOrderDetails } from "@/app/actions/orderAction";
import { getProducts } from "@/app/actions/productAction";
import OrderForm from "./OrderForm";

export default async function Page({ params }: any) {
    const { orderId } = await params;

    // Fetch dữ liệu cần thiết
    const [products, orders] = await Promise.all([
        getProducts(),
        getOrders()
    ]);

    const orderInfo = orders.find((o: any) => String(o.id) === orderId);
    const details = await getOrderDetails(orderId);

    if (!orderInfo) return <div className="p-10 text-center italic">Không tìm thấy đơn hàng</div>;

    return (
        <div className="p-6">
            <OrderForm 
                orderInfo={orderInfo} 
                initialDetails={details} 
                products={products} 
            />
        </div>
    );
}