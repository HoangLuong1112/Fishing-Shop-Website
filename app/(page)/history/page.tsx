import React from 'react';
import Link from 'next/link';
import { getOrderHistory } from '@/app/actions/shopAction';
import { useAuth } from '@/app/provider/AuthProvider';

// Mock data phòng trường hợp chưa có đơn hàng nào trong DB
const MOCK_ORDERS = [
  {
    id: "1001",
    order_time: new Date().toISOString(),
    status: "success",
    total_price: 1250000,
    OrderItems: [
      {
        quantity: 1,
        item_price: 1250000,
        Product: {
          product_name: "Cần câu Shimano LunaMis S86ML",
          image_url: "https://via.placeholder.com/150"
        }
      }
    ]
  },
  {
    id: "1002",
    order_time: new Date().toISOString(),
    status: "approving",
    total_price: 450000,
    OrderItems: [
      {
        quantity: 2,
        item_price: 225000,
        Product: {
          product_name: "Mồi câu cá giả cao cấp",
          image_url: "https://via.placeholder.com/150"
        }
      }
    ]
  }
];

export default async function OrderHistoryPage() {
  // Thay 'user_123' bằng ID user thật từ session của bạn
//   const user = useAuth()
  let orders = await getOrderHistory('');

  if (!orders || orders.length === 0) orders = MOCK_ORDERS;

  // Helper để hiển thị nhãn trạng thái
  const getStatusLabel = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      approving: { label: "Chờ duyệt", color: "bg-amber-100 text-amber-700" },
      approved: { label: "Đã duyệt", color: "bg-blue-100 text-blue-700" },
      shipping: { label: "Đang giao", color: "bg-indigo-100 text-indigo-700" },
      success: { label: "Thành công", color: "bg-green-100 text-green-700" },
      cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700" },
    };
    return map[status] || { label: status, color: "bg-gray-100 text-gray-700" };
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black text-gray-900 uppercase italic">Lịch sử mua hàng</h1>
          <Link href="/" className="text-sm text-blue-600 hover:underline">Tiếp tục mua sắm</Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center shadow-sm border border-gray-100">
            <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào.</p>
            <Link href="/" className="px-6 py-2 bg-gray-900 text-white rounded-lg inline-block">Mua ngay</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => {
              const statusInfo = getStatusLabel(order.status);
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Header đơn hàng */}
                  <div className="px-6 py-4 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4 bg-gray-50/50">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-gray-400">Mã đơn: #{order.id}</span>
                      <span className="text-xs text-gray-400">|</span>
                      <span className="text-sm text-gray-500">
                        {new Date(order.order_time).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>

                  {/* Danh sách sản phẩm trong đơn */}
                  <div className="p-6 space-y-4">
                    {order.OrderItems.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                          <img 
                            src={item.Product?.image_url || "/placeholder.jpg"} 
                            alt="" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="grow">
                          <h4 className="text-sm font-bold text-gray-800 line-clamp-1">
                            {item.Product?.product_name}
                          </h4>
                          <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">
                            {item.item_price.toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer đơn hàng: Tổng tiền */}
                  <div className="px-6 py-4 bg-white border-t border-gray-50 flex justify-between items-center">
                    <span className="text-sm text-gray-500">Tổng cộng:</span>
                    <span className="text-lg font-black text-orange-600">
                      {order.total_price.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}