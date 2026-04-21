import Sidebar, { SidebarItem } from "@/app/components/Sidebar";

const adminSidebar: SidebarItem[] = [
    { title: "Quản lý tài khoản", href: "/admin/accounts"},
    // { title: "Quản lý hệ thống", href: "/admin/system" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <Sidebar data={adminSidebar} />
            <main className="flex-1 bg-slate-50 p-8">
                {children}
            </main>
        </div>
    );
}