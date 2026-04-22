"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/app/utils/TypeGlobal';

export default function ProductDetailInterface({ product }: { product: Product }) {
    const [quantity, setQuantity] = useState(1);
    const router = useRouter();

    const handleBuyNow = () => {
        const params = new URLSearchParams({
            id: product.id,
            name: product.product_name,
            price: product.price.toString(),
            qty: quantity.toString(),
            img: product.image_url
        });
        router.push(`/checkout?${params.toString()}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <img 
                        src={product.image_url || "https://via.placeholder.com/600x600?text=No+Image"} 
                        alt={product.product_name}
                        className="w-full h-auto object-cover aspect-square hover:scale-105 transition-transform duration-500"
                    />
                </div>

                {/* BÊN PHẢI: THÔNG TIN */}
                <div className="flex flex-col">
                    <div className='mt-5 mb-7'>
                        <span className="text-cyan-100 font-bold lowercase text-[16px] tracking-widest border-2 border-black rounded-full px-3 py-1 bg-cyan-900">{product.category_name}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl capitalize font-black text-gray-900 mb-4 leading-tight">{product.product_name}</h1>

                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-3xl font-bold text-orange-600">{product.price.toLocaleString('vi-VN')}₫</span>
                        {product.status ? (
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full italic">Còn hàng ({product.stock_quantity})</span>
                        ) : (
                            <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full italic">Tạm hết hàng</span>
                        )}
                    </div>

                    <div className="border-t border-b border-gray-100 py-6 mb-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 tracking-wider">Mô tả sản phẩm</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}</p>
                    </div>

                    <div className="mt-4 space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-gray-700">Số lượng:</span>
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-fit">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-100 transition-colors">-</button>
                                <span className="px-4 py-2 font-bold min-w-12.5 text-center border-x border-gray-300">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)}className="px-4 py-2 hover:bg-gray-100 transition-colors">+</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            <button onClick={handleBuyNow} disabled={!product.status}
                                className={`py-4 rounded-xl font-black uppercase tracking-wider transition-all shadow-lg 
                                ${product.status ? 
                                    'bg-orange-500 text-white hover:bg-orange-600 active:scale-95 shadow-orange-200' 
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                }`}>
                                Mua ngay
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}