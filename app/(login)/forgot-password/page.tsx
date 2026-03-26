export default function ForgotPassword() {
    return (
        <div className="bg-[#38384C] h-screen flex items-center justify-center">

            <form className="w-200 h-auto m-4 border-4 border-white rounded-lg overflow-hidden">
                
                <div className="bg-[#C1E6FF] flex flex-col gap-4 p-4">
                    <p className="text-4xl font-bold py-5">Quên mật khẩu</p>
                    <div>
                        <label className="text-lg">Nhập Email của bạn</label>
                        <input type="email" required className="text-lg bg-white h-11 w-full" />
                    </div>

                    <div>
                        <p>Captcha</p>
                    </div>

                    <button className="h-12 text-2xl bg-blue-400 hover:bg-blue-500 transition">Gửi yêu cầu</button>
                    
                </div>

            </form>

        </div>
    )
}