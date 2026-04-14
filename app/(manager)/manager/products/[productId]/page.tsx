
interface PageProps {
    params: Promise<{ id: string }>; // Trong Next.js bản mới, params là một Promise
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;
    
    return (
        <div>
            <h1>Đang xem bài viết có ID là: {id}</h1>
        </div>
    );
}