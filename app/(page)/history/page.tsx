import { getCurrentUser } from "@/app/actions/getCurrentUser";
import OrderHistoryInterface from "./OrderHistoryInterface";
import { getOrderHistory } from "@/app/actions/shopAction";

export default async function OrderHistoryPage() {
    const user = await getCurrentUser()
    console.log("Current user:", user?.id)
    let orders = await getOrderHistory(user?.id || "")
    console.log("Fetched orders:", orders)

    return (
        <OrderHistoryInterface initialData={orders} />
    )
}