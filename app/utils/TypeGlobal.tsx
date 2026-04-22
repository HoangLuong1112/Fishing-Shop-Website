export type UserProfile = {
    id?: string;
    username?: string;
    email?: string;
    role?: string;
    is_active?: boolean;
    created_at?: string;
    avatar_url?: string;
}

export interface Product {
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

export interface Employee {
    id: string;
    id_user?: string;
    id_department?: string;
    id_position?: string;
    employee_name: string;
    profile_picture: string;
    birthday: string;
    gender: boolean;
    cic: string;
    tax_id: string;
    marital_status: boolean;
    address_p: string;
    address_c: string;
    phone: string;
    email: string;
    hired_date: string;
    status: boolean;
    department_name: string; //FK
    position_name: string; //FK
    base_salary: number; //FK
}

export interface Order {
    id: string
    id_user: string
    order_time: string
    receiver_name: string
    shipping_address: string
    phone: string
    status: string // approving, approved, shipping, success, cancelled
    total_price: number
}

export interface OrderDetail {
    id: string
    id_order: string
    id_product: string
    quantity: number
    price: number
    product_name: string //FK, đã có getProduct
}

export interface Supplier {
    id: string
    supplier_name: string
    phone: string
    email: string
    address: string
}

export interface Import {
    id: string
    id_supplier: string
    id_employee: string
    import_date: string
    total_cost: number
    note: string
    supplier_name: string //FK, đã có getSupplier
    employee_name: string //FK, đã có getEmployee
}

export interface ImportDetail {
    id: string
    id_import: string
    id_product: string
    quantity: number
    import_price: number
    product_name: string //FK, đã có getProduct
}

export interface Export {
    id: string
    id_employee: string
    id_order: string
    export_date: string
    note: string
}
