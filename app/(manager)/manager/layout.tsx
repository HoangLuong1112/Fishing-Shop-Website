import Sidebar, { SidebarItem } from "@/app/components/Sidebar";

const managerSidebar: SidebarItem[] = [
    { title: "Quản lý sản phẩm", href: "/manager/products"},
    { title: "Quản lý nhân sự", href: "/manager/human-resources" },
    { title: "Quản lý kho hàng", href: "/manager/stocks" },
    { title: "Quản lý đơn hàng", href: "/manager/orders" },
    { title: "Thống kê", href: "/manager/statistics" }, 
];

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <Sidebar data={managerSidebar} />
            <main className="flex-1 bg-slate-50 p-8">
                {children}
            </main>
        </div>
    );
}