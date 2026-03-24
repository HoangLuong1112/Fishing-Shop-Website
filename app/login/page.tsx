import Image from "next/image"

export default function Login() {
    return (
        <div className="bg-gray-200 h-screen flex items-center justify-center">

            <div className="w-[1000px] h-[500px] m-4 grid grid-cols-2 gap-4 border-2 border-blue-500 bg-gray-400">

                <Image alt="login-picture" src="/image/fish.jpg" width={400} height={300} className="w-fit h-[500px] object-cover" loading="eager"/>

                <div className="bg-green-400">
                    <label className="text-lg">tên đăng nhập</label>
                    <input className="h-11 bg-gray-100 px-3 outline-none" />

                    <label className="text-lg">mật khẩu</label>
                    <input type="password" className="h-11 bg-gray-100 px-3 outline-none" />

                    <div className="flex items-center text-sm mt-1">
                        <input type="checkbox" />
                        <span className="ml-2">Ghi nhớ đăng nhập</span>
                    </div>

                    <button className="h-14 bg-lime-400 text-2xl hover:bg-lime-500 transition">
                        Đăng nhập
                    </button>

                    <button className="h-14 bg-lime-400 text-2xl hover:bg-lime-500 transition">
                        Đăng ký
                    </button>
                </div>
            </div>

            {/* <div className="w-225 h-112.5 flex border-2 border-blue-500 bg-gray-400">
                
                <div className="w-[35%] bg-red-500"></div>

                <div className="w-[65%] flex items-center justify-center">
                    <div className="w-[70%] flex flex-col gap-4">
                        
                        <label className="text-lg">tên đăng nhập</label>
                        <input className="h-11 bg-gray-100 px-3 outline-none" />

                        <label className="text-lg">mật khẩu</label>
                        <input type="password" className="h-11 bg-gray-100 px-3 outline-none" />

                        <div className="flex items-center text-sm mt-1">
                        <input type="checkbox" />
                        <span className="ml-2">Ghi nhớ đăng nhập</span>
                        </div>

                        <button className="h-14 bg-lime-400 text-2xl hover:bg-lime-500 transition">
                            Đăng nhập
                        </button>

                        <button className="h-14 bg-lime-400 text-2xl hover:bg-lime-500 transition">
                            Đăng ký
                        </button>

                    </div>
                </div>

            </div> */}
        </div>
    )
}