import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-12">
          <Image
            className="dark:invert mx-auto mb-6"
            src="/next.svg"
            alt="Next.js logo"
            width={150}
            height={30}
            priority
          />
          <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
            Server Components & SSR Playground
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Explore and understand the differences between server components, 
            client components, and various rendering patterns in Next.js.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link 
            href="/server-components"
            className="bg-blue-50 hover:bg-blue-100 p-6 rounded-lg border border-blue-200 transition-colors"
          >
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              🖥️ Server Components
            </h2>
            <p className="text-blue-600">
              Learn how server components render on the server and send HTML to the client.
            </p>
          </Link>

          <Link 
            href="/client-components"
            className="bg-purple-50 hover:bg-purple-100 p-6 rounded-lg border border-purple-200 transition-colors"
          >
            <h2 className="text-xl font-semibold text-purple-800 mb-2">
              💻 Client Components
            </h2>
            <p className="text-purple-600">
              Explore interactive components that run in the browser with hooks and events.
            </p>
          </Link>

          <Link 
            href="/data-fetching"
            className="bg-green-50 hover:bg-green-100 p-6 rounded-lg border border-green-200 transition-colors"
          >
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              📊 Data Fetching
            </h2>
            <p className="text-green-600">
              Compare server-side vs client-side data fetching patterns and performance.
            </p>
          </Link>

          <Link 
            href="/hydration"
            className="bg-orange-50 hover:bg-orange-100 p-6 rounded-lg border border-orange-200 transition-colors"
          >
            <h2 className="text-xl font-semibold text-orange-800 mb-2">
              ⚡ Hydration
            </h2>
            <p className="text-orange-600">
              Understand how static HTML becomes interactive through hydration.
            </p>
          </Link>
        </div>

        <div className="mt-12 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Key Concepts to Understand:
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Server Components:</h4>
              <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Render on server (build time or request time)</li>
                <li>• Can access databases directly</li>
                <li>• Send HTML, not JavaScript</li>
                <li>• Better initial performance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Client Components:</h4>
              <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Render in browser after hydration</li>
                <li>• Can use hooks and event handlers</li>
                <li>• Interactive and dynamic</li>
                <li>• Larger bundle size</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
