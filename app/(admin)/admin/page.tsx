import { getUsers } from "@/app/actions/accountAction";
import UserStatisticsInterface from "./UserStatisticsInterface";

export default async function UserStatisticsPage() {
    const users = await getUsers();

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">
                <UserStatisticsInterface initialUsers={users} />
            </div>
        </div>
    );
}