import Sidebar, { SidebarItem } from "@/app/components/Sidebar";

const managerSidebar: SidebarItem[] = [
    { title: "Quản lý sản phẩm", href: "/admin/ebola"},
    { title: "Quản lý nhân sự", href: "/admin/data" },
    { title: "Quản lý kho hàng", href: "/admin/data" },
    { title: "Quản lý đơn hàng", href: "/admin/data" },
    { title: "Thống kê", href: "/admin/data" }, 
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