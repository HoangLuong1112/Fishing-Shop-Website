"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
    Search, 
    Plus, 
    Filter, 
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    CheckCircle2,
    XCircle
} from "lucide-react";
import Link from "next/link";
import { getProducts } from "@/app/actions/productAction";

interface Product {
    id: string;
    id_category?: string
    category_name: string;
    product_name: string;
    description: string;
    price: number;
    stock_quantity: number;
    image_url: string;
    status: boolean;
}

const MOCK_DATA: Product[] = [
    {id: "01",category_name: "Cần câu",product_name: "iPhone 15 Pro",description: "Chip A17 Pro, khung Titan siêu bền.",price: 28990000,stock_quantity: 50,image_url: "https://picsum.photos/50",status: true,},
    {id: "02",category_name: "Cần câu",product_name: "MacBook Air M2",description: "Mỏng nhẹ, hiệu năng vượt trội.",price: 24500000,stock_quantity: 0,image_url: "",status: false,},
    {id: "03",category_name: "Bạch ngọc thử, Cẩu tẩu phanh, sực xí quách ",product_name: "iPhone 15 Pro",description: "Chip A17 Pro, khung Titan siêu bền.",price: 28990000,stock_quantity: 50,image_url: '',status: true,},
    {id: "04",category_name: "Cần câu",product_name: "MacBook Air M2",description: "Mỏng nhẹ, hiệu năng vượt trội.",price: 24500000,stock_quantity: 0,image_url: "https://picsum.photos/50",status: false,},
    {id: "05",category_name: "Cần câu",product_name: "iPhone 15 Pro",description: "Chip A17 Pro, khung Titan siêu bền.",price: 28990000,stock_quantity: 50,image_url: "https://picsum.photos/50",status: true,},
    {id: "06",category_name: "Cần câu",product_name: "MacBook Air M2",description: "Mỏng nhẹ, hiệu năng vượt trội.",price: 24500000,stock_quantity: 0,image_url: "https://picsum.photos/50",status: false,},
    {id: "07",category_name: "Cần câu",product_name: "iPhone 15 Pro",description: "Chip A17 Pro, khung Titan siêu bền.",price: 28990000,stock_quantity: 50,image_url: "https://picsum.photos/50",status: true,},
    {id: "08",category_name: "Cần câu",product_name: "MacBook Air M2",description: "Mỏng nhẹ, hiệu năng vượt trội.",price: 24500000,stock_quantity: 0,image_url: "https://picsum.photos/50",status: false,},
    {id: "09",category_name: "Cần câu",product_name: "iPhone 15 Pro",description: "Chip A17 Pro, khung Titan siêu bền.",price: 28990000,stock_quantity: 50,image_url: "https://picsum.photos/50",status: true,},
    {id: "10",category_name: "Cần câu",product_name: "MacBook Air M2",description: "Mỏng nhẹ, hiệu năng vượt trội.",price: 24500000,stock_quantity: 0,image_url: "https://picsum.photos/50",status: false,},
];

export default function ProductManagement() {

    // TEST
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Sử dụng useEffect để kích hoạt việc gọi API khi trang vừa load
    useEffect(() => {
        async function loadData() {
            try {
                setIsLoading(true);
                const data = await getProducts();
                setProducts(data);
            } catch (err) {
                console.error("Lỗi:", err);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []); // Mảng rỗng [] đảm bảo hàm này chỉ chạy 1 lần duy nhất
    ////////////////////////////////////////

    // State cho lọc và tìm kiếm
    const [searchTerm, setSearchTerm] = useState("");
    
    // State cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Mặc định 10 dòng

    // 2. Logic Xử lý dữ liệu (Search & Pagination)
    const filteredData = useMemo(() => {
        return MOCK_DATA.filter(p => 
            p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const currentItems = filteredData.slice(startIndex, startIndex + pageSize);

    // Reset về trang 1 nếu tìm kiếm
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 font-sans">Danh sách sản phẩm</h1>
                    <p className="text-slate-500 text-sm">Quản lý tổng số {filteredData.length} sản phẩm</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all active:scale-95 shadow-sm">
                    <Plus size={18} />
                    Thêm sản phẩm
                </button>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm mã hoặc tên sản phẩm..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 text-sm font-medium">
                    <Filter size={16} />
                    Lọc nâng cao
                </button>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* test */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 font-semibold text-slate-700 text-sm">Sản phẩm</th>
                                <th className="p-4 font-semibold text-slate-700 text-sm text-center">Mã SP</th>
                                <th className="p-4 font-semibold text-slate-700 text-sm">Danh mục</th>
                                <th className="p-4 font-semibold text-slate-700 text-sm text-right">Giá bán</th>
                                <th className="p-4 font-semibold text-slate-700 text-sm text-center">Tồn kho</th>
                                <th className="p-4 font-semibold text-slate-700 text-sm text-center">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {currentItems.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50 cursor-pointer transition-colors group">
                                    <td className="p-4">
                                        <Link href={`/manager/products/${product.id}`} className="flex items-center gap-3 hover:bg-slate-300 transition-colors rounded-md overflow-hidden">
                                            {product.image_url && (
                                                <img src={product.image_url} alt="" className="w-10 h-10 rounded-md object-cover border border-slate-200" />
                                            )}
                                            <div>
                                                <div className="font-medium text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{product.product_name}</div>
                                                <div className="text-xs text-slate-700 truncate max-w-40">{product.description}</div>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="p-4 text-xs text-slate-500 font-mono text-center">{product.id}</td>
                                    <td className="p-4 text-sm text-slate-600 max-w-40">{product.category_name}</td>
                                    <td className="p-4 text-sm text-slate-900 font-bold text-right">{product.price.toLocaleString('vi-VN')}đ</td>
                                    <td className="p-4 text-sm text-center font-medium">{product.stock_quantity}</td>
                                    <td className="p-4">
                                        <div className="flex justify-center">
                                            {product.status ? (
                                                <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border border-emerald-100">
                                                    <CheckCircle2 size={12} /> Đang bán
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-50 px-2 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border border-slate-100">
                                                    <XCircle size={12} /> Hết hàng
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 3. Phân trang kiểu Shadcn UI */}
                <div className="px-4 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
                    <div className="text-sm text-slate-500">
                        Hiển thị <b>{startIndex + 1}</b> - <b>{Math.min(startIndex + pageSize, filteredData.length)}</b> trong <b>{filteredData.length}</b> sản phẩm
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-6">
                        {/* Lựa chọn số dòng hiển thị */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-500">Số dòng:</span>
                            <select 
                                className="text-sm border border-slate-200 rounded p-1 outline-none hover:border-slate-300 cursor-pointer"
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1);
                                }}>
                                {[5, 10, 15, 20].map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                        </div>

                        {/* Các nút điều hướng trang */}
                        <div className="flex items-center gap-1">
                            <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}
                                className="p-2 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed">
                                <ChevronsLeft size={16} />
                            </button>
                            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}
                                className="p-2 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed">
                                <ChevronLeft size={16} />
                            </button>
                        
                            <div className="text-sm font-medium px-4">
                                Trang {currentPage} / {totalPages || 1}
                            </div>

                            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0}
                                className="p-2 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed">
                                <ChevronRight size={16} />
                            </button>
                            <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0}
                                className="p-2 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed">
                                <ChevronsRight size={16} />
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}