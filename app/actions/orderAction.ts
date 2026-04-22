import { createClient } from "@/utils/supabase/client";
import { Order, OrderDetail } from "../utils/TypeGlobal";

// Lấy danh sách đơn hàng
export async function getOrders() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("Order")
        .select(`
            id,
            id_user,
            order_time,
            receiver_name,
            shipping_address,
            phone,
            status,
            total_price
        `)
        .order('order_time', { ascending: false }); // Ưu tiên đơn mới nhất

    if (error) {
        console.error("Error fetching orders:", error);
        return [];
    }

    return data as Order[];
}

// Thêm đơn hàng mới
export async function addOrder(formData: Omit<Order, "id">) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("Order")
        .insert([{
            id_user: formData.id_user,
            order_time: formData.order_time,
            receiver_name: formData.receiver_name,
            shipping_address: formData.shipping_address,
            phone: formData.phone,
            status: formData.status,
            total_price: formData.total_price,
        }])
        .select();

    if (error) throw new Error(error.message);
    return data;
}

// Cập nhật thông tin đơn hàng (ví dụ đổi trạng thái status)
export async function updateOrder(id: string, formData: Partial<Order>) {
    const supabase = await createClient();
    const { id: _id, ...updateData } = formData;
    
    const { data, error } = await supabase
        .from("Order")
        .update(updateData)
        .eq("id", id)
        .select();

    if (error) throw new Error(error.message);
    return data;
}
export async function getUnapprovedOrders() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("Order")
        .select(`
            id,
            id_user,
            order_time,
            receiver_name,
            shipping_address,
            phone,
            status,
            total_price
        `)
        .eq("status", "approving") // Lọc các đơn hàng chưa được duyệt
        .order('order_time', { ascending: true });

    if (error) {
        console.error("Error fetching orders:", error);
        return [];
    }
    return data as Order[];
}

// Lấy chi tiết của một đơn hàng
export async function getOrderDetails(id_order: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("OrderItems")
        .select(`
            id,
            id_order,
            id_product,
            quantity,
            item_price,
            Product (product_name)
        `)
        .eq("id_order", id_order);

    if (error) {
        console.error("Error fetching order details:", error);
        return [];
    }

    return data.map((item: any) => ({
        ...item,
        price: item.item_price, 
        product_name: item.Product?.product_name || "Không xác định"
    }));
}

// Thêm sản phẩm vào đơn hàng
export async function addOrderItem(formData: Omit<OrderDetail, "id" | "product_name">) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("OrderItems")
        .insert([{
            id_order: formData.id_order,
            id_product: formData.id_product,
            quantity: formData.quantity,
            item_price: formData.price, // Dùng price từ interface gửi xuống
        }])
        .select();

    if (error) throw new Error(error.message);

    await updateOrderTotalPrice(formData.id_order);
    return data;
}

// Sửa chi tiết đơn hàng
export async function updateOrderItem(id: string, formData: Partial<OrderDetail>) {
    const supabase = await createClient();
    
    // Chuẩn bị data update (map price về item_price của DB)
    const updateData: any = { ...formData };
    if (formData.price) {
        updateData.item_price = formData.price;
        delete updateData.price;
    }
    delete updateData.product_name;
    delete updateData.id;

    const { data, error } = await supabase
        .from("OrderItems")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);

    if (data.id_order) {
        await updateOrderTotalPrice(data.id_order);
    }
    return data;
}

// Xóa sản phẩm khỏi đơn hàng
export async function deleteOrderItem(id: string) {
    const supabase = await createClient();

    const { data: item } = await supabase
        .from("OrderItems")
        .select("id_order")
        .eq("id", id)
        .single();

    const { error } = await supabase
        .from("OrderItems")
        .delete()
        .eq("id", id);

    if (error) throw new Error(error.message);

    if (item?.id_order) {
        await updateOrderTotalPrice(item.id_order);
    }
    return true;
}

// Hàm nội bộ cập nhật lại total_price cho bảng Order
async function updateOrderTotalPrice(id_order: string) {
    const supabase = await createClient();

    const { data: items, error: fetchError } = await supabase
        .from("OrderItems")
        .select("quantity, item_price")
        .eq("id_order", id_order);

    if (fetchError) throw fetchError;

    const newTotal = items.reduce((sum, item) => {
        return sum + (Number(item.quantity) * Number(item.item_price));
    }, 0);

    const { error: updateError } = await supabase
        .from("Order")
        .update({ total_price: newTotal })
        .eq("id", id_order);

    if (updateError) throw updateError;
}

// Hàm cho StockDashboard
export async function approveOrder(id: string, approve: boolean) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("Order")
        .update({ status: approve ? 'approved' : 'cancelled' })
        .eq("id", id)
        .select();

    if (approve) {
        updateOrderTotalPrice(id)
    }

    if (error) throw new Error(error.message);
    return data;
}

// chỉ tạo đơn hàng mới từ user (Order, OrderItems), không update giá tiền tại đây, xác nhận đơn rồi mới update
export async function createNewOrderFromUser(payload: {
    id_user: string;
    receiver_name: string;
    phone: string;
    shipping_address: string;
    total_price: number;
    status: string;
    items: {
        id_product: string | number;
        quantity: number;
        item_price: number;
    }[];
}) {
    const supabase = await createClient();
    // const userId = 

    try {
        // 1. Tạo Order trước
        const { data: orderData, error: orderError } = await supabase
            .from("Order")
            .insert([{
                id_user: payload.id_user,
                receiver_name: payload.receiver_name,
                phone: payload.phone,
                shipping_address: payload.shipping_address,
                total_price: payload.total_price,
                status: payload.status,
                order_time: new Date().toISOString(),
            }])
            .select()
            .single();

        if (orderError) throw orderError;

        const orderId = orderData.id;

        // 2. Tạo OrderItems
        const itemsToInsert = payload.items.map(item => ({
            id_order: orderId,
            id_product: Number(item.id_product),
            quantity: item.quantity,
            item_price: item.item_price
        }));

        const { error: itemError } = await supabase
            .from("OrderItems")
            .insert(itemsToInsert);

        if (itemError) throw itemError;

        return { success: true, orderId };

    } catch (error: any) {
        console.error("Add order error:", error.message);
        return { success: false, error: error.message };
    }
}