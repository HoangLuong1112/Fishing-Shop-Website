// app/dashboard/salary/MySalaryInterface.tsx
"use client";

import React, { useState } from "react";
import { 
    FileText, 
    Download, 
    Calendar, 
    TrendingUp, 
    ChevronRight,
    Landmark,
    Info,
    FileSpreadsheet // Import thêm icon mới
} from "lucide-react";
import { Salary, SalaryDetail } from "@/app/utils/TypeGlobal";
import { getSalaryDetails } from "@/app/actions/salaryAction";
import * as XLSX from "xlsx";

interface Props {
    employee: any;
    salaryHistory: Salary[];
}

export default function SalaryInterface({ employee, salaryHistory }: Props) {
    const [selectedSalary, setSelectedSalary] = useState<Salary | null>(salaryHistory[0] || null);
    const [details, setDetails] = useState<SalaryDetail[]>([]);
    const [loadingDetails, setLoadingDetails] = useState(false);

    React.useEffect(() => {
        if (selectedSalary) {
            fetchDetails(selectedSalary.id);
        }
    }, [selectedSalary]);

    const fetchDetails = async (salaryId: string) => {
        setLoadingDetails(true);
        const data = await getSalaryDetails(salaryId);
        setDetails(data);
        setLoadingDetails(false);
    };

    const formatVND = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // 1. Hàm xuất Excel cho THÁNG hiện tại (Giữ nguyên cũ)
    const exportToExcelMonth = () => {
        if (!selectedSalary || details.length === 0) return;

        const dataToExport = details.map(d => ({
            "Nội dung": d.detail,
            "Loại": d.detail_calculation === "add" ? "Cộng (+)" : d.detail_calculation === "sub" ? "Trừ (-)" : "Thông tin",
            "Số tiền (VNĐ)": d.amount,
            "Ghi chú": d.note || ""
        }));

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `Thang_${selectedSalary.month}_${selectedSalary.year}`);
        XLSX.writeFile(wb, `Luong_${employee.employee_name}_T${selectedSalary.month}_${selectedSalary.year}.xlsx`);
    };

    // 2. Hàm xuất Excel cho cả NĂM
    const exportToExcelYear = () => {
        if (!selectedSalary || salaryHistory.length === 0) return;

        // Lọc tất cả các tháng thuộc cùng năm với tháng đang chọn
        const yearRecords = salaryHistory.filter(s => s.year === selectedSalary.year);

        const dataToExport = yearRecords.map(s => ({
            "Tháng": `Tháng ${s.month}`,
            "Năm": s.year,
            "Họ tên": employee.employee_name,
            "Mã nhân viên": employee.id,
            "Thực nhận (VNĐ)": s.final_salary
        }));

        // Thêm dòng tổng cộng ở cuối
        const totalYear = yearRecords.reduce((sum, s) => sum + (s.final_salary || 0), 0);
        dataToExport.push({
            "Tháng": "TỔNG CỘNG",
            "Năm": selectedSalary.year as any,
            "Họ tên": "" as any,
            "Mã nhân viên": "" as any,
            "Thực nhận (VNĐ)": totalYear as any
        });

        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `Luong_Nam_${selectedSalary.year}`);
        XLSX.writeFile(wb, `Bao_Cao_Luong_Nam_${selectedSalary.year}_${employee.employee_name}.xlsx`);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6 bg-slate-50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Phiếu lương cá nhân</h1>
                    <p className="text-slate-500 text-sm">Xem và tải về chi tiết thu nhập hàng tháng</p>
                </div>
                
                <div className="flex gap-2">
                    {/* Nút xuất năm */}
                    {selectedSalary && (
                        <button 
                            onClick={exportToExcelYear}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition shadow-md text-sm font-medium"
                        >
                            <FileSpreadsheet size={18} /> Xuất Excel Năm {selectedSalary.year}
                        </button>
                    )}

                    {/* Nút xuất tháng */}
                    {selectedSalary && (
                        <button 
                            onClick={exportToExcelMonth}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition shadow-md text-sm font-medium"
                        >
                            <Download size={18} /> Xuất Excel Tháng {selectedSalary.month}
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Cột trái: Lịch sử nhận lương */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white rounded-xl border shadow-sm p-4">
                        <div className="flex items-center gap-2 font-semibold text-slate-700 mb-4 border-b pb-2">
                            <TrendingUp size={18} className="text-blue-500" />
                            Lịch sử nhận lương
                        </div>
                        <div className="space-y-2 max-h-150 overflow-y-auto pr-2 custom-scrollbar">
                            {salaryHistory.map((s) => (
                                <div 
                                    key={s.id}
                                    onClick={() => setSelectedSalary(s)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                                        selectedSalary?.id === s.id 
                                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500 shadow-sm" 
                                        : "hover:border-slate-300 bg-white"
                                    }`}
                                >
                                    <div>
                                        <div className="font-bold text-slate-900">Tháng {s.month}/{s.year}</div>
                                        <div className="text-xs text-slate-500 italic font-medium">
                                            {formatVND(s.final_salary)}
                                        </div>
                                    </div>
                                    <ChevronRight size={18} className={selectedSalary?.id === s.id ? "text-blue-500" : "text-slate-300"} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Cột phải: Chi tiết lương (Giữ nguyên phần render của bạn...) */}
                <div className="lg:col-span-8 space-y-6">
                    {selectedSalary ? (
                        <>
                            {/* Card Tổng số (Card xanh) */}
                            <div className="bg-linear-to-br from-blue-700 to-indigo-800 rounded-2xl p-6 text-white shadow-xl flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2 opacity-80 text-sm mb-1">
                                        <Calendar size={16} /> 
                                        Phiếu lương tháng {selectedSalary.month}/{selectedSalary.year}
                                    </div>
                                    <div className="text-3xl font-bold">{formatVND(selectedSalary.final_salary)}</div>
                                    <div className="mt-2 text-xs bg-white/20 inline-block px-2 py-1 rounded">
                                        Nhân viên: {employee.employee_name}
                                    </div>
                                </div>
                                <Landmark size={60} className="opacity-20" />
                            </div>

                            {/* Bảng chi tiết (Table chi tiết khoản) */}
                            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                                <div className="p-4 border-b bg-slate-50 font-semibold text-slate-700 flex items-center gap-2">
                                    <FileText size={18} className="text-slate-400" />
                                    Chi tiết các khoản
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="bg-slate-50/50 border-b text-slate-500 uppercase text-[10px] font-bold">
                                                <th className="p-4">Danh mục</th>
                                                <th className="p-4 text-center">Tính toán</th>
                                                <th className="p-4 text-right">Số tiền</th>
                                                <th className="p-4">Ghi chú</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {loadingDetails ? (
                                                <tr>
                                                    <td colSpan={4} className="p-10 text-center text-slate-400">Đang tải chi tiết...</td>
                                                </tr>
                                            ) : (
                                                details.map((d) => (
                                                    <tr key={d.id} className="hover:bg-slate-50/50">
                                                        <td className="p-4 font-medium text-slate-700">{d.detail}</td>
                                                        <td className="p-4 text-center">
                                                            {d.detail_calculation === "add" && <span className="text-green-600 font-bold">+</span>}
                                                            {d.detail_calculation === "sub" && <span className="text-red-600 font-bold">-</span>}
                                                            {d.detail_calculation === "none" && <span className="text-slate-300">●</span>}
                                                        </td>
                                                        <td className={`p-4 text-right font-mono font-medium ${
                                                            d.detail_calculation === "sub" ? "text-red-600" : "text-slate-700"
                                                        }`}>
                                                            {formatVND(d.amount)}
                                                        </td>
                                                        <td className="p-4 text-slate-400 italic text-xs">{d.note}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="p-4 bg-slate-50 border-t flex justify-between items-center font-bold">
                                    <span className="text-slate-600">Tổng thực nhận:</span>
                                    <span className="text-blue-700 text-lg">{formatVND(selectedSalary.final_salary)}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl border border-dashed p-20 text-slate-400">
                            <Info size={48} className="mb-4 opacity-20" />
                            <p>Chọn một tháng ở bên trái để xem chi tiết lương.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}