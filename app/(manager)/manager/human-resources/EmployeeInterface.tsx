"use client";

import React, { useState, useMemo } from "react";
import {
    Search,
    Plus,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    CheckCircle2,
    XCircle,
    UserCircle,
    Phone,
    Mail,
    Clock,
    Check,
    X,
    Calculator,
    Banknote
} from "lucide-react";
import Link from "next/link";
import { Employee, LeaveRequest } from "@/app/utils/TypeGlobal";
import { useAuth } from "@/app/provider/AuthProvider";
import { useRouter } from "next/navigation";
import { updateLeaveStatus } from "@/app/actions/leaveAction";



export default function EmployeeInterface({ initialData, initialLeaveRequests, currentEmployee }: { initialData: Employee[], initialLeaveRequests: LeaveRequest[], currentEmployee: Employee | null }) {
    const { user } = useAuth();
    const router = useRouter();
    const [employees] = useState<Employee[]>(initialData);
    const pendingRequests = useMemo(() => 
        initialLeaveRequests.filter(r => r.status === "pending"), 
    [initialLeaveRequests]);

    const [searchTerm, setSearchTerm] = useState("");
    const [deptFilter, setDeptFilter] = useState<string>("all");
    const [posFilter, setPosFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const departments = useMemo(() => Array.from(new Set(employees.map(e => e.department_name))), [employees]);
    const positions = useMemo(() => Array.from(new Set(employees.map(e => e.position_name))), [employees]);

    const handleApproveReject = async (requestId: string, status: "approved" | "rejected") => {
        if (!user) return alert("Bạn cần đăng nhập!");
        
        const confirmMsg = status === "approved" ? "Duyệt đơn này?" : "Từ chối đơn này?";
        if (!confirm(confirmMsg)) return;

        try {
            // Lưu ý: approverId ở đây cần là id_employee (int8) của Manager. 
            // Nếu context user.id là uuid, bạn cần map nó sang id_employee tương ứng.
            // Tạm thời tôi truyền user.id (nếu backend của bạn xử lý được uuid sang int8)
            await updateLeaveStatus(requestId, currentEmployee?.id || '0', status);
            router.refresh(); // Reload để cập nhật data mới từ server
        } catch (error) {
            alert("Lỗi khi cập nhật trạng thái đơn.");
        }
    };

    const filteredData = useMemo(() => {
        let result = [...employees];
        const keyword = searchTerm.trim().toLowerCase();

        if (keyword) {
            result = result.filter(e => {
                // Ép kiểu sang String để tránh lỗi .toLowerCase() nếu id là number
                const name = e.employee_name?.toLowerCase() || "";
                const id = String(e.id).toLowerCase();
                const phone = String(e.phone || "");
                const email = e.email?.toLowerCase() || "";

                return name.includes(keyword) || 
                       id.includes(keyword) || 
                       phone.includes(keyword) || 
                       email.includes(keyword);
            });
        }

        if (deptFilter !== "all") {
            result = result.filter(e => e.department_name === deptFilter);
        }

        if (posFilter !== "all") {
            result = result.filter(e => e.position_name === posFilter);
        }

        if (statusFilter !== "all") {
            const statusBool = statusFilter === "true";
            result = result.filter(e => e.status === statusBool);
        }

        // Sắp xếp an toàn cho cả string và number id
        return result.sort((a, b) => String(a.id).localeCompare(String(b.id), undefined, {numeric: true}));
    }, [employees, searchTerm, deptFilter, posFilter, statusFilter]);

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
                    <h1 className="text-2xl font-bold text-slate-900">Quản lý nhân sự</h1>
                    <p className="text-slate-500 text-sm">
                        Tổng số {filteredData.length} nhân viên
                    </p>
                </div>
                <Link href="/manager/human-resources/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                    <Plus size={18} />
                    Thêm nhân viên
                </Link>
            </div>

            {pendingRequests.length > 0 && (
                <div className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden">
                    <div className="bg-amber-50 px-4 py-3 border-b border-amber-100 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-amber-700 font-semibold">
                            <Clock size={18} />
                            <span>Đơn nghỉ phép chờ duyệt ({pendingRequests.length})</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 font-medium border-b">
                                <tr>
                                    <th className="p-3">Nhân viên</th>
                                    <th className="p-3">Loại</th>
                                    <th className="p-3">Thời gian</th>
                                    <th className="p-3">Lý do</th>
                                    <th className="p-3 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {pendingRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-3 font-medium text-blue-600">{req.employee_name}</td>
                                        <td className="p-3 capitalize">{req.type}</td>
                                        <td className="p-3">
                                            {new Date(req.start_date).toLocaleDateString('vi-VN')} - {new Date(req.end_date).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="p-3 max-w-xs truncate text-slate-500" title={req.reason}>
                                            {req.reason}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex justify-center gap-2">
                                                <button 
                                                    onClick={() => handleApproveReject(req.id, "approved")}
                                                    className="p-1.5 bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition"
                                                    title="Duyệt"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleApproveReject(req.id, "rejected")}
                                                    className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition"
                                                    title="Từ chối"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Toolbar */}
            <div className="bg-white p-3 rounded-xl border flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-75">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm tên, mã, SĐT, email..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>

                <select
                    value={deptFilter}
                    onChange={(e) => setDeptFilter(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white"
                >
                    <option value="all">Tất cả phòng ban</option>
                    {departments.map(d => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>

                <select
                    value={posFilter}
                    onChange={(e) => setPosFilter(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white"
                >
                    <option value="all">Tất cả vị trí</option>
                    {positions.map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 bg-white"
                >
                    <option value="all">Trạng thái</option>
                    <option value="true">Đang làm việc</option>
                    <option value="false">Đã nghỉ việc</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 border-b">
                            <tr>
                                <th className="p-4 font-semibold text-slate-700">Nhân viên</th>
                                <th className="p-4 font-semibold text-slate-700 text-center">Mã NV</th>
                                <th className="p-4 font-semibold text-slate-700">Liên hệ</th>
                                <th className="p-4 font-semibold text-slate-700">Phòng ban</th>
                                <th className="p-4 font-semibold text-slate-700">Vị trí</th>
                                <th className="p-4 font-semibold text-slate-700 text-center">Trạng thái</th>
                                <th className="p-4 font-semibold text-slate-700 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((emp) => (
                                <tr key={emp.id} className="border-b hover:bg-blue-50/30 transition-colors">
                                    <td className="p-4">
                                        <Link href={`/manager/human-resources/${emp.id}`} className="flex gap-3 items-center">
                                            {emp.profile_picture ? (
                                                <img src={emp.profile_picture} alt={emp.employee_name} className="w-10 h-10 rounded-full object-cover border bg-white" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                                                    <UserCircle className="text-slate-400" size={24} />
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium text-slate-900 leading-none mb-1">{emp.employee_name}</div>
                                                <div className="text-xs text-slate-500 italic">
                                                    {emp.gender ? "Nam" : "Nữ"} • {new Date(emp.birthday).toLocaleDateString('vi-VN')}
                                                </div>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-600 border">
                                            {emp.id}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1 text-xs">
                                            <div className="flex items-center gap-1.5 text-slate-600">
                                                <Phone size={12} className="text-slate-400" /> {emp.phone}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-600 uppercase">
                                                <Mail size={12} className="text-slate-400" /> {emp.email.split('@')[0]}...
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm font-medium text-slate-700">{emp.department_name}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-sm text-slate-600">{emp.position_name}</span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center">
                                            {emp.status ? (
                                                <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full text-xs font-medium">
                                                    <CheckCircle2 size={12} /> Đang làm
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-full text-xs font-medium">
                                                    <XCircle size={12} /> Nghỉ việc
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center items-center gap-4">
                                            <Link href={`/manager/human-resources/${emp.id}/salary`} className="text-blue-600 hover:text-blue-800 transition">
                                                <Banknote size={20} />
                                            </Link>
                                            <Link href={`/manager/human-resources/${emp.id}/salary-calculate`} className="text-blue-600 hover:text-blue-800 transition">
                                                <Calculator size={16} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50 border-t">
                    <div className="text-xs font-medium text-slate-500">
                        Hiển thị {startIndex + 1} - {Math.min(startIndex + pageSize, filteredData.length)} / {filteredData.length}
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(1)} 
                            className="p-1.5 border rounded-md bg-white hover:bg-slate-50 disabled:opacity-30 transition shadow-sm"
                        >
                            <ChevronsLeft size={16} />
                        </button>
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} 
                            className="p-1.5 border rounded-md bg-white hover:bg-slate-50 disabled:opacity-30 transition shadow-sm"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        
                        <div className="px-3 py-1 bg-white border rounded-md text-xs font-bold text-blue-600 shadow-sm">
                            {currentPage} / {totalPages || 1}
                        </div>

                        <button 
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} 
                            className="p-1.5 border rounded-md bg-white hover:bg-slate-50 disabled:opacity-30 transition shadow-sm"
                        >
                            <ChevronRight size={16} />
                        </button>
                        <button 
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(totalPages)} 
                            className="p-1.5 border rounded-md bg-white hover:bg-slate-50 disabled:opacity-30 transition shadow-sm"
                        >
                            <ChevronsRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}