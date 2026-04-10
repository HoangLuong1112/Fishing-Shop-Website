import { Search } from "lucide-react";

export default function SearchBar() {
    return (
        <div className='relative w-full max-w-md'>
            <div className="flex items-center bg-neutral-800 px-3 py-1.5 rounded-full w-full max-w-md hover:bg-neutral-700 transition">
                <Search size={18} className="text-gray-400" />
                <input type="text" placeholder="Tìm kiếm bài hát, nghệ sĩ..." className="bg-transparent outline-none text-sm text-white ml-2 w-full placeholder-gray-400"/>
            </div>
        </div>
    )
}