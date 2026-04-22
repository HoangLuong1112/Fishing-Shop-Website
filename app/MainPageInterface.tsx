"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Product } from './utils/TypeGlobal';

interface Props {
    initialProducts: Product[];
    initialCategories: any[];
}

export default function MainPageInterface({ initialProducts, initialCategories }: Props) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const { displayProducts, totalPages } = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return {
            displayProducts: initialProducts.slice(start, end),
            totalPages: Math.ceil(initialProducts.length / itemsPerPage)
        };
    }, [currentPage, initialProducts]);

    const goToPage = (page: number) => {
        setCurrentPage(page);
        const element = document.getElementById('product-list');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            <section className="relative w-full h-75 md:h-112.5 bg-blue-900">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center z-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 uppercase">Thế Giới Đồ Câu</h1>
                    <p className="text-lg md:text-xl opacity-90">Chuyên cần câu và dụng cụ câu cá chất lượng cao</p>
                </div>
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070')] bg-cover bg-center" />
            </section>

            <div className="max-w-7xl mx-auto px-4">
                {/* 2. Category Box */}
                <section className="bg-white -mt-10 relative z-20 rounded-xl shadow-md border border-gray-100 p-6">
                    <h2 className="text-gray-400 uppercase text-xs font-bold mb-6 tracking-widest">Danh mục sản phẩm</h2>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                        {initialCategories.map((cat) => (
                            <div key={cat.id} className="flex flex-col items-center group cursor-pointer">
                                <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:rotate-6 transition-all shadow-sm">
                                    <span className="text-2xl">🎣</span>
                                </div>
                                <span className="text-sm text-center font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                                    {cat.category_name}
                                </span>
                            </div>  
                        ))}
                    </div>
                </section>

                {/* 3. Product Listing */}
                <section id="product-list" className="mt-16">
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-black text-gray-800 uppercase italic">Sản phẩm mới</h2>
                        <div className="h-0.5 grow bg-gray-200 mt-1"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                        {displayProducts.map((product) => (
                            <Link href={`/${product.id}`} key={product.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col group">
                                <div className="relative aspect-4/5 bg-gray-50 overflow-hidden">
                                    <img 
                                        src={product.image_url || "/placeholder-fishing.jpg"} 
                                        alt={product.product_name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {!product.status && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <span className="bg-white text-black text-[10px] font-bold px-3 py-1 rounded-full">HẾT HÀNG</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="p-4 flex flex-col grow">
                                    <span className="text-[10px] text-orange-500 font-bold uppercase">{product.category_name}</span>
                                    <h3 className="text-sm font-bold text-gray-800 line-clamp-2 mt-1 mb-2 hover:text-blue-600">
                                        {product.product_name}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* 4. Local Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-16 flex justify-center items-center gap-3">
                            <button 
                                onClick={() => goToPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className={`px-5 py-2 rounded-lg border transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white hover:shadow-md'}`}
                            >
                                Trang trước
                            </button>
                            
                            <div className="flex gap-2">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => goToPage(i + 1)}
                                        className={`w-10 h-10 flex items-center justify-center rounded-lg border font-bold transition-all ${
                                            currentPage === i + 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button 
                                onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className={`px-5 py-2 rounded-lg border transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white hover:shadow-md'}`}
                            >
                                Trang sau
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}