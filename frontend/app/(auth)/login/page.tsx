import Link from "next/link";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 min-h-screen">
        <Link href="/"><h2 className="text-lg font-bold bg-(--primary-color) text-(--background-color) p-2">anticstore.com</h2></Link>
        <div className="flex flex-col justify-center items-center bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <p className="text-xl font-bold text-(--text-color)">Login</p>
            <form className="flex flex-col gap-2 w-full mt-4">
                <div className="flex flex-col gap-1">
                    <p className="text-md font-medium text-(--text-color)/80">E-mail</p>
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

                <div className="flex items-center justify-between gap-1 mt-2">
                    <label className="flex items-center gap-2 text-(--text-color)/80">
                        <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-(--accent-color) focus:ring-(--accent-color) accent-(--accent-color)"
                        />
                        Remember me
                    </label>
                    <div>
                        <Link href="/forgot-password" className="text-sm text-(--accent-color) hover:underline">
                            Forgot your password?
                        </Link>
                    </div>
                </div>

                <button
                    className="bg-(--accent-color) text-white rounded-md px-4 py-2 hover:bg-(--accent-color)/80"
                    type="submit"
                >
                    Login
                </button>
            </form>

            <p className="text-sm text-(--text-color)/80 mt-4">
                {`Don't have an account?`}{" "}
                <Link href="/signup" className="text-(--accent-color) hover:underline">
                    Sign up
                </Link>
            </p>
        </div>
    </div>
  );
}