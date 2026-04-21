import { getImportDetails, getImports } from "@/app/actions/importAction";
import { getProducts } from "@/app/actions/productAction";
import ImportForm from "./ImportForm";

export default async function Page({ params }: any) {
    const { importId } = await params;
    const [products, imports] = await Promise.all([
        getProducts(),
        getImports()
    ]);

    const importInfo = imports.find((i: any) => String(i.id) === importId);
    const details = await getImportDetails(importId);

    if (!importInfo) return <div className="p-10 text-center italic">Không tìm thấy phiếu nhập</div>;

    return (
        <div className="p-6">
            <ImportForm 
                importInfo={importInfo} 
                initialDetails={details} 
                products={products} 
            />
        </div>
    );
}