
import { getProduct } from "@/app/actions/shopAction";
import ProductDetailInterface from "./ProductDetailInterface";
import { Product } from "@/app/utils/TypeGlobal";

// Mock data nếu không tìm thấy sản phẩm
const MOCK_PRODUCT: Product = {
    id: "0",
    product_name: "Cần câu Shimano mẫu lỗi",
    category_name: "Cần câu",
    description: "Dữ liệu sản phẩm hiện không khả dụng. Vui lòng thử lại sau.",
    price: 0,
    stock_quantity: 0,
    image_url: "https://via.placeholder.com/600x600?text=No+Image",
    status: false,
};
export default async function ProductPage( { params } : { params: { product: string }} ) {
	const { product: productId } = await params

	console.log("Product ID from URL:", productId)

	const products = await getProduct(productId);

	const product = products && products.length > 0 ? products[0] : MOCK_PRODUCT

	return (
		<div className="min-h-screen bg-white">
		<ProductDetailInterface product={product} />
		</div>
	);
}