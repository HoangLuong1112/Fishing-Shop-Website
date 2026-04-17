import { getProducts } from "@/app/actions/productAction";
import ProductInterface, { Product } from "./ProductInterface";

const MOCK_DATA: Product[] = [
    {id: "01",category_name: "Cần câu",product_name: "iPhone 15 Pro",description: "Chip A17 Pro, khung Titan siêu bền.",price: 28990000,stock_quantity: 50,image_url: "https://picsum.photos/50",status: true,},
    {id: "02",category_name: "Cần câu",product_name: "MacBook Air M2",description: "Mỏng nhẹ, hiệu năng vượt trội.",price: 24500000,stock_quantity: 0,image_url: "",status: false,},
];

export default async function Page() {
    let products: Product[] = [];

    try {
        const data = await getProducts();
        if (!data || data.length === 0) {
            products = MOCK_DATA;
        } else {
            products = data;
        }
    } catch (error) {
        console.error("Fetch lỗi, dùng mock:", error);
        products = MOCK_DATA;
    }

    return <ProductInterface initialData={products} />;
}