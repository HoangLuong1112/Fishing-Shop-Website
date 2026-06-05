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
    return (
        <div>
            <p className="text-xl text-red-500">insert chart here</p>
        </div>
    )
}
