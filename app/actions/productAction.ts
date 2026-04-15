// "use server";

// import { createClient } from "@/utils/supabase/server"; 
import { createClient } from "@/utils/supabase/client";
// import { revalidatePath } from "next/cache";
// import { cookies } from "next/headers";

interface Product {
  id: string;
  id_category?: string;
  category_name: string;
  product_name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  status: boolean;
}

/**
 * Lấy danh sách sản phẩm kèm tên danh mục
 */
export async function getProducts(): Promise<Product[]> {
    // const cookieStore = await cookies()
    // const supabase = await createClient(cookieStore)
    const supabase = await createClient()

    // Query sử dụng syntax join của Supabase: Category(...) 
    // Nó sẽ lấy thông tin từ bảng Category dựa trên FK Id_Category
    // c
    
    const { data, error } = await supabase
        .from("Product")
        .select(`
        id:id,
        id_category:id_category,
        product_name:product_name,
        description,
        price,
        stock_quantity,
        image_url,
        status,
        Category (
            category_name:Category_name
        )
        `);

    if (error) {
        console.error("Error fetching products:", error);
        return [];
    }

    console.log("Fetched products with categories:", data);

    // Map lại data để phẳng hóa (flatten) object Category theo interface của bạn
    return (data as any[]).map((item) => ({
        id: item.id,
        id_category: item.id_category,
        product_name: item.product_name,
        description: item.description,
        price: item.price,
        stock_quantity: item.stock_quantity,
        image_url: item.image_url,
        status: item.status,
        category_name: item.Category?.category_name || "Không xác định",
    }));
}

// /**
//  * Thêm sản phẩm mới
//  */
// export async function addProduct(formData: Omit<Product, "id" | "category_name">) {
//   const supabase = await createClient();

//   const { data, error } = await supabase
//     .from("Product")
//     .insert([
//       {
//         Id_Category: formData.id_category,
//         Product_name: formData.product_name,
//         description: formData.description,
//         price: formData.price,
//         stock_quantity: formData.stock_quantity,
//         image_url: formData.image_url,
//         status: formData.status,
//       },
//     ])
//     .select();

//   if (error) throw new Error(error.message);
  
//   revalidatePath("/"); // Cập nhật lại cache cho trang chủ hoặc trang danh sách
//   return data;
// }

// /**
//  * Sửa thông tin sản phẩm
//  */
// export async function updateProduct(id: string, formData: Partial<Product>) {
//   const supabase = await createClient();

//   const { data, error } = await supabase
//     .from("Product")
//     .update({
//       Id_Category: formData.id_category,
//       Product_name: formData.product_name,
//       description: formData.description,
//       price: formData.price,
//       stock_quantity: formData.stock_quantity,
//       image_url: formData.image_url,
//       status: formData.status,
//     })
//     .eq("Id_Product", id)
//     .select();

//   if (error) throw new Error(error.message);

//   revalidatePath("/"); 
//   return data;
// }