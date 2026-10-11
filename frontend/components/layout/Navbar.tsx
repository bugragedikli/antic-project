import Link from "next/link";
import { BsSearch } from "react-icons/bs";

export default function Navbar(){
    return (
        <nav className="w-full bg-(--secondary-color)">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-2">
                <Link href="/"><h2 className="text-lg font-bold bg-(--primary-color) p-2">anticstore.com</h2></Link>
                <form action="/search" className="group relative w-full max-w-md">
                    <input
                        type="search"
                        name="q"
                        placeholder="Search for products..."
                        className="w-full rounded-l-[1px] rounded-r-[1px] bg-white/10 py-2.5 pl-3 pr-10 text-sm placeholder:text-white/50 outline-none group-focus-within:bg-(--background-color) group-focus-within:text-(--text-color) group-focus-within:placeholder:text-(--text-color) group-focus-within:rounded-r-sm"
                    />
                    <button
                        type="submit"
                        aria-label="Search"
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-white/60 hover:text-white group-focus-within:bg-(--primary-color) group-focus-within:text-white group-focus-within:outline-none group-focus-within:rounded-r-[1px]"
                    >
                        <BsSearch />
                    </button>
                </form>
                <div className="flex items-center gap-4 text-sm">

                    {/*<p className="text-white/50">|</p>*/}
                    <Link href="/login"
                    className="hover:underline">
                        Login
                    </Link>
                    <Link href="/signup"
                    className="bg-(--accent-color) hover:bg-(--accent-color)/80 px-4 py-2 rounded-[1px]">
                        <p>Create Account</p>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
