import { getCurrentUser } from "@/app/actions/getCurrentUser";
import Sidebar, { SidebarItem } from "@/app/components/Sidebar";

const managerSidebar: SidebarItem[] = [
    { title: "Back to Dashboard", href: "/manager"},
    { title: "Quản lý sản phẩm", href: "/manager/products"},
    { title: "Quản lý nhân sự", href: "/manager/human-resources" },
    { title: "Quản lý đơn hàng/kho", href: "/manager/stocks" },
    { title: "Xem lương", href: "/manager/salary" },
    { title: "Thống kê", href: "/manager/statistics" }, 
];

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
    const user = getCurrentUser()
    console.log("ManagerLayout user:", user) // Thêm log để kiểm tra giá trị của user
    return (
        <div className="flex min-h-screen">
            <Sidebar data={managerSidebar} />
            <main className="flex-1 bg-slate-50 p-8">
                {children}
            </main>
        </div>
    );
}