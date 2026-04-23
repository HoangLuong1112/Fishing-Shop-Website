import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-blue-950 text-white border-t border-blue-900">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    
                    {/* Cột 1: Giới thiệu */}
                    <div className="col-span-1 md:col-span-1">
                        <h2 className="text-2xl font-bold mb-4 text-blue-200" style={{ fontFamily: "var(--font-playwrite)" }}>
                            FishingShop
                        </h2>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Chuyên cung cấp đồ câu nhật bãi, dụng cụ câu cá chính hãng. Uy tín, chất lượng và đam mê trên từng chuyến đi.
                        </p>
                    </div>

                    {/* Cột 2: Liên kết nhanh */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 border-b border-blue-800 pb-2">Liên Kết</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/" className="hover:text-blue-300 transition">Trang chủ</Link></li>
                            <li><Link href="/" className="hover:text-blue-300 transition">Sản phẩm</Link></li>
                            <li><Link href="/" className="hover:text-blue-300 transition">Về chúng tôi</Link></li>
                            <li><Link href="/" className="hover:text-blue-300 transition">Chính sách bảo hành</Link></li>
                        </ul>
                    </div>

                    {/* Cột 3: Liên hệ */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 border-b border-blue-800 pb-2">Thông Tin</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-start gap-2">
                                <MapPin size={16} className="text-blue-400 mt-1" />
                                <span>43/22 Minh Phụng phường Bình Tây, TP. Hồ Chí Minh</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone size={16} className="text-blue-400" />
                                <span>+84 123 456 789</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={16} className="text-blue-400" />
                                <span>contact@fishingshop.vn</span>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 4: Mạng xã hội */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 border-b border-blue-800 pb-2">Kết Nối</h3>
                        <div className="flex gap-4">
                            <Link href="https://www.facebook.com/" className="w-10 h-10 flex items-center justify-center bg-blue-900 rounded-full hover:bg-blue-700 transition">
                                <p className="font-bold text-white">f</p>
                            </Link>
                            <Link href="https://www.instagram.com/" className="w-10 h-10 flex items-center justify-center bg-blue-900 rounded-full hover:bg-blue-700 transition">
                                <p className="font-bold text-white">In</p>
                            </Link>
                        </div>
                        <div className="mt-6">
                            <p className="text-xs text-gray-500 italic">
                                Chấp nhận thanh toán qua thẻ và ví điện tử.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-blue-900 text-center text-sm text-gray-500">
                    <p>© {currentYear} FishingShop - Copyright by Luong</p>
                </div>
            </div>
        </footer>
    );
}