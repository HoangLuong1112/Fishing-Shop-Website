"use client";

import React, { useState } from "react";
import { 
    User, Mail, Phone, MapPin, Calendar, 
    Send, Clock, CheckCircle, XCircle, Plus 
} from "lucide-react";
import { LeaveRequest } from "@/app/utils/TypeGlobal";
import { addLeaveRequest } from "@/app/actions/leaveAction";
import { useRouter } from "next/navigation";

interface Props {
    employee: any;
    initialLeaveRequests: LeaveRequest[];
}

export default function DashboardInterface({ employee, initialLeaveRequests }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
    
    // Form State
    const [formData, setFormData] = useState({
        type: "vacation",
        start_date: "",
        end_date: "",
        reason: ""
    });

    if (!employee) return <div className="p-10 text-center text-red-500">Không tìm thấy thông tin nhân viên.</div>;

    const handleSubmitLeave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addLeaveRequest({
                id_employee: employee.id,
                type: formData.type,
                start_date: formData.start_date,
                end_date: formData.end_date,
                reason: formData.reason,
            });
            alert("Gửi đơn thành công!");
            setFormData({ type: "vacation", start_date: "", end_date: "", reason: "" });
            router.refresh(); // Để cập nhật lại danh sách từ server
        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra khi gửi đơn.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8 bg-slate-50 min-h-screen">
            {/* 1. Profile Header Section */}
            <p className="text-3xl font-bold">Welcome to dashboard, mr {employee.employee_name}</p>

            <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row gap-8 items-start">
                <div className="relative group">
                    <img 
                        src={employee.profile_picture || "https://via.placeholder.com/150"} 
                        alt={employee.employee_name} 
                        className="w-32 h-32 rounded-2xl object-cover border-4 border-slate-50"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-lg shadow-lg">
                        <User size={16} />
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{employee.employee_name}</h1>
                        <p className="text-blue-600 font-medium">{employee.Position?.position_name} • {employee.Department?.department_name}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                            <Mail size={16} className="text-slate-400" /> {employee.email}
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={16} className="text-slate-400" /> {employee.phone}
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-slate-400" /> Tham gia: {new Date(employee.hired_date).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-slate-400" /> {employee.address_c}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 2. Leave Request Form */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border">
                        <div className="flex items-center gap-2 mb-6">
                            <Plus className="text-blue-600" size={20} />
                            <h2 className="text-lg font-semibold text-slate-900">Tạo đơn nghỉ phép</h2>
                        </div>

                        <form onSubmit={handleSubmitLeave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Loại nghỉ phép</label>
                                <select 
                                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                >
                                    <option value="vacation">Nghỉ phép năm</option>
                                    <option value="sick">Nghỉ bệnh</option>
                                    <option value="maternity">Nghỉ thai sản</option>
                                    <option value="else">Khác</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Từ ngày</label>
                                    <input 
                                        type="date" required
                                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Đến ngày</label>
                                    <input 
                                        type="date" required
                                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Lý do</label>
                                <textarea 
                                    rows={3} required
                                    className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Lý do xin nghỉ..."
                                    value={formData.reason}
                                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2 disabled:bg-blue-300"
                            >
                                <Send size={18} />
                                {loading ? "Đang gửi..." : "Gửi yêu cầu"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* 3. History Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                        <div className="p-6 border-b">
                            <h2 className="text-lg font-semibold text-slate-900">Lịch sử nghỉ phép</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Loại</th>
                                        <th className="px-6 py-4">Thời gian</th>
                                        <th className="px-6 py-4 text-center">Trạng thái</th>
                                        <th className="px-6 py-4">Người duyệt</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-sm">
                                    {requests.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center py-10 text-slate-400">Bạn chưa có đơn nghỉ phép nào.</td>
                                        </tr>
                                    ) : (
                                        requests.map((req) => (
                                            <tr key={req.id} className="hover:bg-slate-50">
                                                <td className="px-6 py-4 capitalize font-medium text-slate-700">{req.type}</td>
                                                <td className="px-6 py-4">
                                                    <div className="text-slate-900 font-medium">
                                                        {new Date(req.start_date).toLocaleDateString('vi-VN')}
                                                    </div>
                                                    <div className="text-xs text-slate-500 italic">đến {new Date(req.end_date).toLocaleDateString('vi-VN')}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center">
                                                        {req.status === "approved" && (
                                                            <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs flex items-center gap-1 border border-green-100">
                                                                <CheckCircle size={14} /> Chấp nhận
                                                            </span>
                                                        )}
                                                        {req.status === "pending" && (
                                                            <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs flex items-center gap-1 border border-amber-100">
                                                                <Clock size={14} /> Đang chờ
                                                            </span>
                                                        )}
                                                        {req.status === "rejected" && (
                                                            <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs flex items-center gap-1 border border-red-100">
                                                                <XCircle size={14} /> Từ chối
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-500 font-medium">
                                                    {req.approver_name || "---"}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}