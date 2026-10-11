import Link from "next/link";

export default function Signup() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-screen">
        <Link href="/"><h2 className="text-lg font-bold bg-(--primary-color) text-(--background-color) p-2">anticstore.com</h2></Link>
        <div className="flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <p className="text-xl font-bold text-(--text-color)">Create an account</p>
            <form className="flex flex-col gap-2 w-full mt-4">
                <div className="flex flex-col gap-1">
                    <p className="text-md font-medium text-(--text-color)/80">E-mail</p>
                    <input
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--accent-color)"
                        type="text"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-md font-medium text-(--text-color)/80">Name</p>
                    <input
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--accent-color)"
                        type="text"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-md font-medium text-(--text-color)/80">Surname</p>
                    <input
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--accent-color)"
                        type="text"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <p className="text-md font-medium text-(--text-color)/80">Password</p>
                    <input
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-(--accent-color)"
                        type="password"
                    />
                </div>

                <button
                    className="bg-(--accent-color) text-white rounded-md px-4 py-2 hover:bg-(--accent-color)/80"
                    type="submit"
                >
                    Sign Up with E-mail
                </button>
            </form>

            <p className="text-sm text-(--text-color)/80 mt-4">
                Already have an account?{" "}
                <Link href="/login" className="text-(--accent-color) hover:underline">
                    Log in
                </Link>
            </p>
        </div>
    </div>
  );
}