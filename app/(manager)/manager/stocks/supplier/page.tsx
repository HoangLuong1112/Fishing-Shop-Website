import { getSuppliers } from "@/app/actions/supplierAction"
import SupplierInterface from "./SupplierInterface"

export interface Supplier {
    id: string
    supplier_name: string
    phone: string
    email: string
    address: string
}

const MOCK_DATA: Supplier[] = [];


export default async function SupplierPage () {
    let suppliers: Supplier[] = [];
        
    try {
        const data = await getSuppliers();
        console.log("suppliers:", data);
        if (!data || data.length === 0) {
            suppliers = MOCK_DATA;
        } else {
            suppliers = data;
        }   
    } catch (error) {
        console.error("Fetch error, using mock:", error);
        suppliers = MOCK_DATA;
    }

    return <SupplierInterface initialData={suppliers} />;
}