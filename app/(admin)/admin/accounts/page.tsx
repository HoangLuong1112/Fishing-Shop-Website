import { getUsers } from "@/app/actions/accountAction";
import AccountsInterface from "./AccountsInterface";

export default async function Page() {
    // Chỉ cần lấy danh sách Users
    const users = await getUsers();

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 uppercase">Quản lý tài khoản</h1>
                <p className="text-slate-500">Danh sách người dùng và phân quyền</p>
            </div>
            <AccountsInterface 
                initialData={users} 
            />
        </div>
    );
}