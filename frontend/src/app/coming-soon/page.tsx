import Link from "next/link";
import Image from "next/image";

export default function ComingSoon() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="w-24 h-24 mb-6 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                    <line x1="4" x2="4" y1="22" y2="15" />
                </svg>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                Coming Soon
            </h1>

            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-8">
                We're working hard to bring the SmartConvertX experience to your mobile device.
                Our Android app will be available on the Google Play Store shortly.
            </p>

            <Link
                href="/"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
                Return to Homepage
            </Link>
        </div>
    );
}
