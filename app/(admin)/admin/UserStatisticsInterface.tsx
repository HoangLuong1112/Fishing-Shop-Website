"use client";

import React, { useMemo } from "react";
import { 
    Users, UserCheck, UserX, ShieldCheck, 
    PieChart as PieIcon, BarChart3, TrendingUp 
} from "lucide-react";
import { UserProfile } from "@/app/utils/TypeGlobal";
import { 
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function UserStatisticsInterface({ initialUsers }: { initialUsers: UserProfile[] }) {
    
    const stats = useMemo(() => {
        const total = initialUsers.length;
        const active = initialUsers.filter(u => u.is_active).length;
        const inactive = total - active;

        // Thống kê theo Role
        const roleMap: Record<string, number> = {};
        initialUsers.forEach(u => {
            const r = u.role || "Chưa xác định";
            roleMap[r] = (roleMap[r] || 0) + 1;
        });
        const roleData = Object.keys(roleMap).map(key => ({
            name: key.toUpperCase(),
            value: roleMap[key]
        }));

        // Thống kê theo trạng thái cho BarChart
        const statusData = [
            { name: "Đang hoạt động", count: active, fill: "#10b981" },
            { name: "Bị khóa", count: inactive, fill: "#ef4444" }
        ];

        return { total, active, inactive, roleData, statusData };
    }, [initialUsers]);

    return (
        <div className="space-y-6">
            {/* 1. Tổng quan bằng các con số (Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard 
                    title="Tổng tài khoản" 
                    value={stats.total} 
                    icon={<Users className="text-blue-600" />} 
                    color="bg-blue-50" 
                />
                <StatCard 
                    title="Đang hoạt động" 
                    value={stats.active} 
                    icon={<UserCheck className="text-emerald-600" />} 
                    color="bg-emerald-50" 
                />
                <StatCard 
                    title="Tài khoản bị khóa" 
                    value={stats.inactive} 
                    icon={<UserX className="text-rose-600" />} 
                    color="bg-rose-50" 
                />
                <StatCard 
                    title="Tỷ lệ hoạt động" 
                    value={`${((stats.active / stats.total) * 100).toFixed(1)}%`} 
                    icon={<TrendingUp className="text-amber-600" />} 
                    color="bg-amber-50" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 2. Biểu đồ tròn: Phân bổ Role */}
                <div className="bg-white p-6 rounded-2xl border shadow-sm h-100 flex flex-col">
                    <div className="flex items-center gap-2 font-bold text-slate-700 mb-4">
                        <PieIcon size={20} className="text-slate-400" />
                        Tỷ lệ chức vụ (Roles)
                    </div>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.roleData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.roleData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Biểu đồ cột: Trạng thái hoạt động */}
                <div className="bg-white p-6 rounded-2xl border shadow-sm h-100 flex flex-col">
                    <div className="flex items-center gap-2 font-bold text-slate-700 mb-4">
                        <BarChart3 size={20} className="text-slate-400" />
                        Tình trạng tài khoản
                    </div>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.statusData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip cursor={{fill: '#f8fafc'}} />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={60} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 4. Bảng danh sách rút gọn các Admin/Manager */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-slate-50 flex items-center gap-2 font-bold text-slate-700">
                    <ShieldCheck size={20} className="text-blue-500" />
                    Danh sách quản trị & nhân sự
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                            <tr>
                                <th className="p-4">Username</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Chức vụ</th>
                                <th className="p-4 text-center">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {initialUsers.filter(u => u.role !== 'client').map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-medium text-slate-900">{u.username}</td>
                                    <td className="p-4 text-slate-500">{u.email}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                            u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        {u.is_active ? (
                                            <span className="text-emerald-500 text-xs font-bold">● Active</span>
                                        ) : (
                                            <span className="text-rose-500 text-xs font-bold">● Locked</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Sub-component cho các thẻ số liệu
function StatCard({ title, value, icon, color }: { title: string, value: any, icon: React.ReactNode, color: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4">
            <div className={`${color} p-3 rounded-xl`}>
                {icon}
            </div>
            <div>
                <p className="text-slate-500 text-xs font-medium">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
            </div>
        </div>
    );
}