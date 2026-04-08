import Link from "next/link";

type LinkButtonProps = {
    text: string;
    href: string;
};

export default function LinkButton({ text, href }: LinkButtonProps) {
    return (
        <Link href={href} className="border-2 border-black rounded-lg overflow-hidden">
            <div className="bg-zinc-200 text-black hover:bg-zinc-300 transition px-4 py-2">
                {text}
            </div>
        </Link>
    )
}