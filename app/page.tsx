import { getCategories, getProducts } from './actions/productAction';
import { getSaleProducts } from './actions/shopAction';
import MainPageInterface from './MainPageInterface';
import { Product } from './utils/TypeGlobal';

const MOCK_CATEGORIES = [
  { id: 1, category_name: "Cần câu máy" },
  { id: 2, category_name: "Cần câu tay" },
  { id: 3, category_name: "Mồi giả" },
  { id: 4, category_name: "Dây câu" },
  { id: 5, category_name: "Máy câu" },
  { id: 6, category_name: "Phụ kiện" },
];

const MOCK_PRODUCTS: Product[] = [
    {id: "01",category_name: "Cần câu",product_name: "iPhone 15 Pro",description: "Chip A17 Pro, khung Titan siêu bền.",price: 28990000,stock_quantity: 50,image_url: "https://picsum.photos/50",status: true,},
    {id: "02",category_name: "Cần câu",product_name: "MacBook Air M2",description: "Mỏng nhẹ, hiệu năng vượt trội.",price: 24500000,stock_quantity: 0,image_url: "",status: false,},
];

export default async function HomePage() {
	// const user2 = await getCurrentUser()
	// // console.log("user?: ", user2)
	// return (
	// 	<main className="p-10">
	// 		<h1 className="text-5xl font-bold mb-4">Main Page</h1>
	// 		{user2 && (
	// 			<>
	// 				<div className="p-2 m-2 bg-blue-300">
	// 					<p className='text-2xl font-bold'>Current User:</p>
	// 					<div>{user2?.email}</div>
	// 					<div>{user2?.profile?.role}</div>
	// 					<div>{user2?.role}</div>
	// 				</div>
	// 			</>
	// 		)}
	// 		<LogoutButton />

	// 	</main>
	// )

	let categories: any[] = [];
	let products: Product[] = [];

	try {
		categories = await getCategories();
		products = await getSaleProducts();
		console.log("Fetched sale products:", products)

		if (!categories || categories.length === 0) categories = MOCK_CATEGORIES;
		if (!products || products.length === 0) products = MOCK_PRODUCTS;

	} catch (error) {
		console.error("Fetch lỗi, dùng mock:", error);
	}

	return (
		<MainPageInterface 
			initialProducts={products} 
			initialCategories={categories} 
		/>
	);
}
