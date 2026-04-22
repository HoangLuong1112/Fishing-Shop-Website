"use client";

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { createNewOrderFromUser } from '@/app/actions/orderAction';
import { useAuth } from '@/app/provider/AuthProvider';

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useAuth()

    // console.log("User in checkout page:", user); // Debug thông tin user

    // Lấy dữ liệu từ URL truyền sang
    const productId = searchParams.get('id');
    const productName = searchParams.get('name');
    const price = Number(searchParams.get('price')) || 0;
    const quantity = Number(searchParams.get('qty')) || 1;
    const imageUrl = searchParams.get('img');

    const totalPrice = price * quantity;

    // State cho Form thông tin đơn hàng
    const [formData, setFormData] = useState({
        receiver_name: '',
        phone: '',
        shipping_address: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const userId = user.id; 

        try {
            const orderPayload = {
                ...formData,
                id_user: userId,
                total_price: totalPrice,
                status: 'approving', // Mặc định là chờ duyệt
                items: [
                    {
                        id_product: productId as string,
                        quantity: quantity,
                        item_price: price
                    }
                ]
            };
            if (orderPayload.id_user === null || orderPayload.id_user === undefined || orderPayload.id_user === "") {
                toast.error("User ID is missing when submitting order: ", orderPayload.id_user);
                console.error("User ID is missing when submitting order: ", orderPayload.id_user); // Debug lỗi userId
                return;
            }

            const res = await createNewOrderFromUser(orderPayload);
            if (res.success) {
                toast.success("Đặt hàng thành công! Chúng tôi sẽ liên hệ sớm.");
                router.push('/');
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra, vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Nếu không có thông tin sản phẩm
    if (!productId) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="mb-4">Không tìm thấy thông tin đơn hàng.</p>
                <Link href="/" className="text-blue-600 underline">Quay lại trang chủ</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-5xl mx-auto px-4">
                <h1 className="text-3xl font-black text-gray-900 mb-8 uppercase italic tracking-tighter">Xác nhận đặt hàng</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">


                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
                                Thông tin người nhận
                            </h2>
                            
                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Họ và tên</label>
                                    <input 
                                        required
                                        type="text" 
                                        placeholder="Nhập tên người nhận hàng"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                        value={formData.receiver_name}
                                        onChange={(e) => setFormData({...formData, receiver_name: e.target.value})}
                                    />
                                </div>
                                    
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Số điện thoại</label>
                                    <input 
                                        required
                                        type="tel" 
                                        placeholder="Ví dụ: 0912345xxx"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Địa chỉ nhận hàng</label>
                                    <textarea 
                                        required
                                        rows={3}
                                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
                                        value={formData.shipping_address}
                                        onChange={(e) => setFormData({...formData, shipping_address: e.target.value})}
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-400">
                                <span className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm">2</span>
                                Phương thức thanh toán
                            </h2>
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
                                <input type="radio" checked readOnly className="w-4 h-4 accent-blue-600" />
                                <div>
                                    <p className="text-sm font-bold text-blue-900">Thanh toán khi nhận hàng (COD)</p>
                                    <p className="text-xs text-blue-700">Kiểm tra hàng trước khi thanh toán tiền</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG (1/3) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
                            <h2 className="text-lg font-bold mb-6">Đơn hàng của bạn</h2>
                        
                            <div className="flex gap-4 mb-6 pb-6 border-b border-dashed border-gray-200">
                                <div className="w-16 h-16 bg-gray-50 rounded-lg overflow-hidden shrink-0">
                                    <img src={imageUrl || ""} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="grow">
                                    <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight">{productName}</h3>
                                    <p className="text-xs text-gray-500 mt-1">Số lượng: {quantity}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Tạm tính:</span>
                                    <span className="font-medium">{totalPrice.toLocaleString('vi-VN')}₫</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Phí vận chuyển:</span>
                                    <span className="font-medium text-green-600">Miễn phí</span>
                                </div>
                                <div className="flex justify-between border-t pt-3">
                                    <span className="font-bold">Tổng cộng:</span>
                                    <span className="font-black text-xl text-orange-600">{totalPrice.toLocaleString('vi-VN')}₫</span>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                form="checkout-form"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt mua"}
                            </button>
                            
                            <p className="text-[10px] text-gray-400 text-center mt-4 italic">
                                Bằng cách nhấn đặt mua, bạn đồng ý với các điều khoản giao dịch của chúng tôi.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}