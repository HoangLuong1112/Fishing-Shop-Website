// app/(manager)/manager/human-resources/[employeeId]/salary-calculate/page.tsx
import { getOrCreateSalary } from "@/app/actions/salaryAction";
import SalaryCalculateInterface from "./SalaryCalculateInterface";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

export default async function SalaryCalculatePage({ 
    params 
}: { 
    params: { employeeId: string } 
}) {
    const { employeeId } = await params;
    const user = await getCurrentUser()
    
    // Logic xác định tháng tính lương:
    // Nếu hôm nay >= ngày 25, tính lương cho tháng hiện tại.
    // Nếu chưa đến ngày 25, thường sẽ xem lại hoặc tính cho tháng trước (tùy bạn chọn, ở đây tôi lấy tháng hiện tại).
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    let salaryData: any = null;

    
    try {
        salaryData = await getOrCreateSalary(employeeId, month, year, user);
    } catch (error) {
        console.error("Error initializing salary:", error);
    }

    return (
        <SalaryCalculateInterface 
            initialSalary={salaryData} 
            month={month}
            year={year}
            employeeId={employeeId}
        />
    );
}