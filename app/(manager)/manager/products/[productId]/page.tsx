import { getCategories, getProducts } from "@/app/actions/productAction";
import ProductForm from "../[productId]/ProductForm";

interface Props {
    params: { productId: string };
}

export default async function Page({ params }: Props) {
    const { productId } = await params;

    const categories = await getCategories();

    if (productId === "new") {
        return (
            <div className="p-6">
                <h1 className="text-4xl font-bold mb-10">Thêm sản phẩm</h1>
                <ProductForm categories={categories} />
            </div>
        );
    }

    const products = await getProducts();
    const product = products.find(p => String(p.id) === productId);

    if (!product) {
        return <div className="p-6">Không tìm thấy sản phẩm</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold mb-10">Sửa sản phẩm</h1>
            <ProductForm initialData={product} categories={categories} isEdit />
        </div>
    );
}