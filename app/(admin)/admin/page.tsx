import { getUsers } from "@/app/actions/accountAction";
import UserStatisticsInterface from "./UserStatisticsInterface";

export default async function UserStatisticsPage() {
    const users = await getUsers();

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-slate-900">Thống kê hệ thống</h1>
                    <p className="text-slate-500 text-sm">Phân tích dữ liệu tài khoản và người dùng</p>
                </div>

                <UserStatisticsInterface initialUsers={users} />
            </div>
        </div>
    );
}