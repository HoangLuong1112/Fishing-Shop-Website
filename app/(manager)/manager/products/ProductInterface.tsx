"use client";

import React, { useState, useMemo } from "react";
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

interface Product {
    id: string;
    id_category?: string;
    category_name: string;
    product_name: string;
    description: string;
    price: number;
    stock_quantity: number;
    image_url: string;
    status: boolean;
}

export default function ProductPage({ initialData }: { initialData: Product[] }) {

    const [products] = useState<Product[]>(initialData);

    // search
    const [searchTerm, setSearchTerm] = useState("");

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const filteredData = useMemo(() => {
        return products.filter(p =>
            p.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, products]);

    const totalPages = Math.ceil(filteredData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const currentItems = filteredData.slice(startIndex, startIndex + pageSize);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Danh sách sản phẩm</h1>
                    <p className="text-slate-500 text-sm">
                        Quản lý tổng số {filteredData.length} sản phẩm
                    </p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    <Plus size={18} />
                    Thêm sản phẩm
                </button>
            </div>

            {/* Toolbar */}
            <div className="bg-white p-3 rounded-xl border flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm mã hoặc tên sản phẩm..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg">
                    <Filter size={16} />
                    Lọc
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="p-4">Sản phẩm</th>
                                <th className="p-4 text-center">Mã</th>
                                <th className="p-4">Danh mục</th>
                                <th className="p-4 text-right">Giá</th>
                                <th className="p-4 text-center">Kho</th>
                                <th className="p-4 text-center">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((product) => (
                                <tr key={product.id} className="border-b hover:bg-slate-50">
                                    <td className="p-4">
                                        <Link href={`/manager/products/${product.id}`} className="flex gap-3">
                                            {product.image_url && (
                                                <img src={product.image_url} className="w-10 h-10 rounded" />
                                            )}
                                            <div>
                                                <div className="font-medium">{product.product_name}</div>
                                                <div className="text-xs text-slate-500">{product.description}</div>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="p-4 text-center">{product.id}</td>
                                    <td className="p-4">{product.category_name}</td>
                                    <td className="p-4 text-right font-bold">
                                        {product.price.toLocaleString("vi-VN")}đ
                                    </td>
                                    <td className="p-4 text-center">{product.stock_quantity}</td>
                                    <td className="p-4 text-center">
                                        {product.status ? (
                                            <CheckCircle2 className="text-green-500" size={16} />
                                        ) : (
                                            <XCircle className="text-gray-400" size={16} />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 flex justify-between items-center">
                    <div>
                        {startIndex + 1} - {Math.min(startIndex + pageSize, filteredData.length)} / {filteredData.length}
                    </div>

                    <div className="flex gap-2">
                        <button onClick={() => setCurrentPage(1)}><ChevronsLeft size={16} /></button>
                        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}><ChevronLeft size={16} /></button>
                        <span>{currentPage} / {totalPages || 1}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}><ChevronRight size={16} /></button>
                        <button onClick={() => setCurrentPage(totalPages)}><ChevronsRight size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}