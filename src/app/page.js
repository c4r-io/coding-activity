import Link from 'next/link';
export default function Home() {
  return (
    <div className="bg--gray-700">
      <div className="wrapper">
        <nav className="bg-gray-50 dark:bg-gray-700">
          <div className="max-w-screen-xl px-4 py-3 mx-auto">
            <div className="flex items-center">
              <ul className="flex flex-row font-medium mt-0 mr-6 space-x-8 text-sm">
                <li>
                  <Link
                    className="text-gray-900 dark:text-white hover:underline"
                    href="/"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-gray-900 dark:text-white hover:underline"
                    href="/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
      <div className="flex justify-center items-center h-screen w-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        <h2>Authoring Dashboard</h2>
      </div>
    </div>
  );
}
