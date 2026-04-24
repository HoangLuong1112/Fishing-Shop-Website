// app/(manager)/manager/analytics/AnalyticsInterface.tsx
"use client";

import React, { useMemo, useState } from "react";
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { 
    Users, Box, DollarSign, TrendingUp, AlertCircle, Wallet, Calendar 
} from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function StatisticsInterface({ employees, salaries, products, orders, imports }: any) {
    const [activeTab, setActiveTab] = useState("finance");
    
    // State cho bộ lọc thời gian
    const now = new Date();
    const [selectedMonth, setSelectedMonth] = useState<string>((now.getMonth() + 1).toString());
    const [selectedYear, setSelectedYear] = useState<string>(now.getFullYear().toString());

    // Tạo danh sách năm để chọn (từ 2024 đến nay)
    const years = Array.from({ length: 5 }, (_, i) => (now.getFullYear() - i).toString());
    const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

    // --- XỬ LÝ DỮ LIỆU THỐNG KÊ LỌC THEO THỜI GIAN ---
    const filteredData = useMemo(() => {
        const m = parseInt(selectedMonth);
        const y = parseInt(selectedYear);

        // 1. Lọc Orders & Imports theo tháng/năm đã chọn
        const filteredOrders = orders.filter((o: any) => {
            const d = new Date(o.order_time);
            return d.getMonth() + 1 === m && d.getFullYear() === y;
        });

        const filteredImports = imports.filter((i: any) => {
            const d = new Date(i.import_date);
            return d.getMonth() + 1 === m && d.getFullYear() === y;
        });

        // 2. Lọc Lương theo tháng/năm
        const filteredSalaries = salaries.filter((s: any) => 
            parseInt(s.month) === m && parseInt(s.year) === y
        );

        const hrStats = filteredSalaries.reduce((acc: any, s: any) => {
            // Tìm nhân viên để lấy tên phòng ban
            const emp = employees.find((e: any) => e.id === s.id_employee);
            const dept = emp?.department_name || "Khác";
            
            if (!acc.deptSalary[dept]) acc.deptSalary[dept] = 0;
            acc.deptSalary[dept] += Number(s.final_salary);
            
            return acc;
        }, { deptSalary: {} });

        const deptSalaryChart = Object.keys(hrStats.deptSalary).map(key => ({
            name: key,
            total: hrStats.deptSalary[key]
        }));

        // 3. Tính toán số liệu tổng hợp cho StatCards
        const revenue = filteredOrders.reduce((acc: number, o: any) => 
            o.status === 'success' ? acc + Number(o.total_price) : acc, 0
        );
        const cost = filteredImports.reduce((acc: number, i: any) => acc + Number(i.total_cost), 0);
        const payroll = filteredSalaries.reduce((acc: number, s: any) => acc + Number(s.final_salary), 0);
        const cancelledCount = filteredOrders.filter((o: any) => o.status === 'cancelled').length;

        // 4. Dữ liệu cho biểu đồ (Phân bổ theo ngày trong tháng đó để xem biến động)
        const daysInMonth = new Date(y, m, 0).getDate();
        const dailyChart = Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dayRevenue = filteredOrders.reduce((acc: number, o: any) => {
                const d = new Date(o.order_time);
                return (d.getDate() === day && o.status === 'success') ? acc + Number(o.total_price) : acc;
            }, 0);
            const dayCost = filteredImports.reduce((acc: number, imp: any) => {
                const d = new Date(imp.import_date);
                return d.getDate() === day ? acc + Number(imp.total_cost) : acc;
            }, 0);

            return {
                name: `Ngày ${day}`,
                revenue: dayRevenue,
                cost: dayCost,
                profit: dayRevenue - dayCost
            };
        });

        // 5. Kho (Sản phẩm sắp hết hàng - cái này không phụ thuộc thời gian lọc nhưng vẫn giữ để quan sát)
        const lowStock = products.filter((p: any) => p.stock_quantity < 10);

        return { revenue, cost, payroll, cancelledCount, dailyChart, lowStock, deptSalaryChart, filteredSalaries };
    }, [selectedMonth, selectedYear, orders, imports, salaries, products]);

    return (
        <div className="space-y-6">
            {/* TOOLBAR: TABS & FILTERS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-3 rounded-2xl border shadow-sm">
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                    <TabButton active={activeTab === "finance"} onClick={() => setActiveTab("finance")} icon={<Wallet size={16}/>} label="Tài chính" />
                    <TabButton active={activeTab === "hr"} onClick={() => setActiveTab("hr")} icon={<Users size={16}/>} label="Nhân sự" />
                    <TabButton active={activeTab === "warehouse"} onClick={() => setActiveTab("warehouse")} icon={<Box size={16}/>} label="Kho" />
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                        <Calendar size={18} /> Thời gian:
                    </div>
                    <select 
                        value={selectedMonth} 
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                    >
                        {months.map(m => <option key={m} value={m}>Tháng {m}</option>)}
                    </select>
                    <select 
                        value={selectedYear} 
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                    >
                        {years.map(y => <option key={y} value={y}>Năm {y}</option>)}
                    </select>
                </div>
            </div>

            {/* TAB CONTENT: FINANCE */}
            {activeTab === "finance" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard title={`Doanh thu T${selectedMonth}`} value={formatVND(filteredData.revenue)} icon={<TrendingUp className="text-emerald-500" />} />
                        <StatCard title={`Chi phí nhập hàng T${selectedMonth}`} value={formatVND(filteredData.cost)} icon={<DollarSign className="text-rose-500" />} />
                        <StatCard title="Lợi nhuận ròng" value={formatVND(filteredData.revenue - filteredData.cost)} icon={<Wallet className="text-blue-500" />} />
                    </div>

                    <div className="bg-white p-6 rounded-2xl border shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <TrendingUp size={20} className="text-blue-500"/> Biến động tài chính trong tháng {selectedMonth}/{selectedYear}
                        </h3>
                        <div className="h-100">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={filteredData.dailyChart}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" hide={filteredData.dailyChart.length > 15} />
                                    <YAxis />
                                    <Tooltip formatter={(val: any) => formatVND(val || 0)} />
                                    <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                                    <Area type="monotone" dataKey="profit" name="Lợi nhuận" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: HR */}
            {activeTab === "hr" && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    {/* Hàng 1: Thẻ con số */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard title={`Tổng quỹ lương T${selectedMonth}`} value={formatVND(filteredData.payroll)} icon={<Wallet className="text-purple-500" />} />
                        <StatCard title="Trung bình lương" value={formatVND(filteredData.payroll / (employees.filter((e:any) => e.status).length || 1))} icon={<TrendingUp className="text-blue-500" />} />
                        <StatCard title="Nhân viên đang làm" value={employees.filter((e:any) => e.status).length} icon={<Users className="text-blue-500" />} />
                    </div>

                    {/* Hàng 2: Biểu đồ */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Biểu đồ chi phí lương theo phòng ban */}
                        <div className="bg-white p-6 rounded-2xl border shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <DollarSign size={18} className="text-purple-500"/> Chi phí lương theo phòng ban
                            </h3>
                            <div className="h-75">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={filteredData.deptSalaryChart} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={100} fontSize={12} />
                                        <Tooltip formatter={(val: any) => formatVND(val || 0)} />
                                        <Bar dataKey="total" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Biểu đồ tròn nhân sự (giữ lại cái cũ của bạn) */}
                        <div className="bg-white p-6 rounded-2xl border shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-6">Phân bổ nhân sự</h3>
                            <div className="h-75">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie 
                                            data={employees.reduce((acc: any, curr: any) => {
                                                const index = acc.findIndex((i: any) => i.name === curr.department_name);
                                                if (index > -1) acc[index].value += 1;
                                                else acc.push({ name: curr.department_name, value: 1 });
                                                return acc;
                                            }, [])} 
                                            dataKey="value" cx="50%" cy="50%" outerRadius={80}
                                        >
                                            {employees.map((_: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Hàng 3: Bảng chi tiết lương tháng này */}
                    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                        <div className="p-4 border-b bg-slate-50 font-bold text-slate-700">
                            Bảng lương chi tiết tháng {selectedMonth}/{selectedYear}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
                                    <tr>
                                        <th className="p-4">Nhân viên</th>
                                        <th className="p-4">Phòng ban</th>
                                        <th className="p-4 text-right">Thực nhận</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {filteredData.filteredSalaries.slice(0, 5).map((s: any) => (
                                        <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4 font-medium">{employees.find((e:any)=>e.id === s.id_employee)?.employee_name}</td>
                                            <td className="p-4 text-slate-500">{employees.find((e:any)=>e.id === s.id_employee)?.department_name}</td>
                                            <td className="p-4 text-right font-bold text-blue-600">{formatVND(s.final_salary)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: WAREHOUSE */}
            {activeTab === "warehouse" && (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-rose-100 shadow-sm">
                            <h3 className="font-bold text-rose-600 mb-4 flex items-center gap-2">
                                <AlertCircle size={20}/> Cảnh báo hết hàng
                            </h3>
                            <div className="space-y-4 max-h-100 overflow-y-auto pr-2">
                                {filteredData.lowStock.map((p: any) => (
                                    <div key={p.id} className="flex justify-between items-center p-3 bg-rose-50 rounded-lg border border-rose-100">
                                        <span className="text-sm font-medium text-slate-700">{p.product_name}</span>
                                        <span className="text-rose-600 font-bold">Tồn: {p.stock_quantity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-6 uppercase text-sm tracking-widest">Hiệu suất bán hàng T{selectedMonth}</h3>
                            <div className="h-87.5">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={filteredData.dailyChart}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" hide={filteredData.dailyChart.length > 15} />
                                        <YAxis />
                                        <Tooltip formatter={(val: any) => formatVND(val ||0)} />
                                        <Bar dataKey="revenue" name="Doanh thu ngày" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Giữ nguyên các Helper Components StatCard, TabButton và hàm formatVND như trước
function TabButton({ active, onClick, icon, label }: any) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                active ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
        >
            {icon} {label}
        </button>
    );
}

function StatCard({ title, value, icon }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{title}</p>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">{value}</h3>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border">{icon}</div>
        </div>
    );
}

function formatVND(amount: number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}