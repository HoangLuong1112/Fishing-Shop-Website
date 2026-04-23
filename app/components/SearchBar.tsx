// import { Search } from "lucide-react";

// export default function SearchBar() {
//     return (
//         <div className='relative w-full max-w-4xl'>
//             <div className="flex items-center bg-neutral-50 px-3 py-2.5 rounded-full w-full max-w-4xl hover:bg-neutral-200 transition">
//                 <Search size={18} className="text-gray-600" />
//                 <input type="text" placeholder="Tìm kiếm sản phẩm..." className="bg-transparent outline-none text-sm text-black ml-2 w-full placeholder-gray-400"/>
//             </div>
//         </div>
//     )
// }

// @/components/SearchBar.tsx
"use client";

import { Search, Loader2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useDebounce } from "use-debounce";
import { Product } from "../utils/TypeGlobal";
import { searchProducts } from "../actions/productAction";

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    
    // Debounce searchTerm: chỉ update value sau khi ngừng gõ 300ms
    const [debouncedQuery] = useDebounce(searchTerm, 300);
    const searchRef = useRef<HTMLDivElement>(null);

    // Xử lý đóng kết quả khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Gọi API khi debouncedQuery thay đổi
    useEffect(() => {
        const performSearch = async () => {
            if (debouncedQuery.trim().length > 0) {
                setIsSearching(true);
                const data = await searchProducts(debouncedQuery);
                setResults(data);
                setIsSearching(false);
                setIsOpen(true);
            } else {
                setResults([]);
                setIsOpen(false);
            }
        };

        performSearch();
    }, [debouncedQuery]);

    return (
        <div className='relative w-full max-w-4xl' ref={searchRef}>
            <div className="flex items-center bg-neutral-50 px-3 py-2.5 rounded-full w-full hover:bg-neutral-200 transition border border-transparent focus-within:border-blue-400">
                {isSearching ? (
                    <Loader2 size={18} className="text-gray-600 animate-spin" />
                ) : (
                    <Search size={18} className="text-gray-600" />
                )}
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => searchTerm && setIsOpen(true)}
                    placeholder="Tìm kiếm sản phẩm..." 
                    className="bg-transparent outline-none text-sm text-black ml-2 w-full placeholder-gray-400"
                />
            </div>

            {/* Dropdown Kết quả */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-100">
                    {results.length > 0 ? (
                        <div className="flex flex-col">
                            {results.map((product) => (
                                <Link 
                                    key={product.id} 
                                    href={`/${product.id}`}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-4 p-3 hover:bg-gray-50 transition border-b last:border-none"
                                >
                                    <div className="relative w-12 h-12 shrink-0">
                                        <img 
                                            src={product.image_url || "/placeholder.png"} 
                                            alt={product.product_name}
                                            className="object-cover rounded-md w-full h-full"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {product.product_name}
                                        </p>
                                        <p className="text-xs text-blue-600 font-medium">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                        </p>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        {product.status ? (
                                            <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold">Còn bán</span>
                                        ) : (
                                            <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-bold">Hết hàng</span>
                                        )}
                                        <span className="text-[10px] text-gray-400">Kho: {product.stock_quantity}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-sm text-gray-500">
                            Không tìm thấy sản phẩm nào cho "{searchTerm}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}