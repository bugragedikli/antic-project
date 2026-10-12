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
        <nav className="w-full bg-(--secondary-color)">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-2">
                <Link href="/"><h2 className="font-extrabold text-xl font-serif">anticstore.com</h2></Link>
                <form action="/search" className="group relative w-full max-w-lg">
                    <input
                        type="search"
                        name="q"
                        placeholder="Search for products..."
                        className="w-full rounded-l-[1px] rounded-r-[1px] bg-white/10 py-2.5 pl-3 pr-10 text-sm placeholder:text-white/50 outline-none group-focus-within:bg-(--background-color) group-focus-within:text-(--text-color) group-focus-within:placeholder:text-(--text-color) group-focus-within:rounded-r-sm"
                    />
                    <button
                        type="submit"
                        aria-label="Search"
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-white/60 hover:text-white group-focus-within:bg-(--accent-color) group-focus-within:text-white group-focus-within:outline-none group-focus-within:rounded-r-[1px]"
                    >
                        <BsSearch />
                    </button>
                </form>
                <div className="flex items-center gap-4 text-sm">
                    <NavSelect label="Currency" options={currencies} defaultValue="EUR" />
                    <NavSelect label="Language" options={languages} defaultValue="en" />
                    <UserMenu />
                </div>
            </div>
        </nav>
    )
}
