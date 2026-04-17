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

export interface Product {
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
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("true"); 
    const [priceSort, setPriceSort] = useState<string>("none");
    const [stockSort, setStockSort] = useState<string>("none");

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // lấy danh sách category
    const categories = useMemo(() => {
        const set = new Set(products.map(p => p.category_name));
        return Array.from(set);
    }, [products]);

    // search + filter + sort
    // memo: mỗi khi render, filter chạy lại
    const filteredData = useMemo(() => {
        let result = [...products];

        const keyword = searchTerm.trim().toLowerCase();

        // search
        if (keyword) {
            result = result.filter(p => {
                const name = p.product_name?.toLowerCase() || "";
                const id = String(p.id).toLowerCase();
                return name.includes(keyword) || id.includes(keyword);
            });
        }

        // filter category
        if (categoryFilter !== "all") {
            result = result.filter(p => p.category_name === categoryFilter);
        }

        // filter status
        if (statusFilter !== "all") {
            const statusBool = statusFilter === "true";
            result = result.filter(p => p.status === statusBool);
        }

        // sort price
        if (priceSort === "asc") {
            result.sort((a, b) => a.price - b.price);
        } else if (priceSort === "desc") {
            result.sort((a, b) => b.price - a.price);
        }

        // sort stock
        if (stockSort === "asc") {
            result.sort((a, b) => a.stock_quantity - b.stock_quantity);
        } else if (stockSort === "desc") {
            result.sort((a, b) => b.stock_quantity - a.stock_quantity);
        }

        return result;
    }, [products, searchTerm, categoryFilter, statusFilter, priceSort, stockSort]);

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
                {/* Category */}
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm"
                >
                    <option value="all">Tất cả danh mục</option>
                    {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>

                {/* Status */}
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm"
                >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="true">Đang bán</option>
                    <option value="false">Hết hàng</option>
                </select>

                {/* Price sort */}
                <select
                    value={priceSort}
                    onChange={(e) => setPriceSort(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm"
                >
                    <option value="none">Giá</option>
                    <option value="asc">Thấp → Cao</option>
                    <option value="desc">Cao → Thấp</option>
                </select>

                {/* Stock sort */}
                <select
                    value={stockSort}
                    onChange={(e) => setStockSort(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm"
                >
                    <option value="none">Tồn kho</option>
                    <option value="asc">Ít → Nhiều</option>
                    <option value="desc">Nhiều → Ít</option>
                </select>
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