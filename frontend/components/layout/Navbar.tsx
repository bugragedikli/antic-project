import Link from "next/link";
import { BsSearch } from "react-icons/bs";
import UserMenu from "./UserMenu";
import NavSelect from "./NavSelect";

const currencies = [
    { value: "EUR", label: "EUR (€)" },
    { value: "USD", label: "USD ($)" },
    { value: "GBP", label: "GBP (£)" },
];

const languages = [
    { value: "en", label: "English" },
    { value: "fr", label: "French" },
    { value: "es", label: "Spanish" },
    { value: "de", label: "German" },
];

export default function Navbar(){
    return (
        <nav className="w-full bg-(--secondary-color) p-2">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-2 py-2">
                <Link href="/"><h2 className="p-2 font-extrabold text-2xl font-serif">anticstore.com</h2></Link>
                <form action="/search" className="group relative w-full max-w-xl">
                    <input
                        type="search"
                        name="q"
                        placeholder="Search for products..."
                        className="w-full rounded-full bg-white/10 py-3 pl-5 pr-10 text-sm placeholder:text-white/50 outline-none group-focus-within:bg-(--background-color) group-focus-within:text-(--text-color) group-focus-within:placeholder:text-(--text-color)"
                    />
                    <button
                        type="submit"
                        aria-label="Search"
                        className="absolute inset-y-0 right-0 flex items-center pr-4 pl-3 text-white/60 hover:text-white group-focus-within:bg-(--accent-color) group-focus-within:text-white group-focus-within:outline-none group-focus-within:rounded-r-full"
                    >
                        <BsSearch />
                    </button>
                </form>
                <div className="flex items-center gap-4 text-sm">
                    {/* <NavSelect label="Currency" options={currencies} defaultValue="EUR" /> */}
                    {/* <NavSelect label="Language" options={languages} defaultValue="en" /> */}
                    <UserMenu />
                </div>
            </div>
            <div className="group flex items-center justify-center gap-8">
                <Link href="/category/1" className="p-2 hover:text-(--accent-color)">NEW ARRIVALS</Link>
                <Link href="/category/1" className="p-2 hover:text-(--accent-color)">FURNITURE</Link>
                <Link href="/category/1" className="p-2 hover:text-(--accent-color)">DECOR</Link>
                <Link href="/category/1" className="p-2 hover:text-(--accent-color)">CLOTHING</Link>
                <Link href="/category/1" className="p-2 hover:text-(--accent-color)">ACCESSORIES</Link>
                <Link href="/category/1" className="p-2 hover:text-(--accent-color)">HOME</Link>
                <Link href="/category/1" className="p-2 hover:text-(--accent-color)">GARDEN</Link>
                <Link href="/category/1" className="p-2 hover:text-(--accent-color) text-red-300">SALE</Link>
            </div>
        </nav>
    )
}
