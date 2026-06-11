"use client";

import React, { useState } from "react";
import { 
    User, Mail, Phone, MapPin, Calendar, 
    Send, Clock, CheckCircle, XCircle, Plus 
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
    employee: any;
}

export default function DashboardInterface({ employee }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        type: "vacation",
        start_date: "",
        end_date: "",
        reason: ""
    });

    if (!employee) return <div className="p-10 text-center text-red-500">Không tìm thấy thông tin nhân viên.</div>;

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

            
        </div>
    );
}