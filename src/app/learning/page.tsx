import Image from "next/image";
import Link from "next/link";

export default function LearningHome() {
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
            Next.js Learning Lab
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Learn Next.js 16 features, React Server Components, and modern web development
            patterns through practical examples and real-world implementations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link
            href="/learning/server-components"
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
            href="/learning/client-components"
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
            href="/learning/data-fetching"
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
            href="/learning/hydration"
            className="bg-orange-50 hover:bg-orange-100 p-6 rounded-lg border border-orange-200 transition-colors"
          >
            <h2 className="text-xl font-semibold text-orange-800 mb-2">
              ⚡ Hydration
            </h2>
            <p className="text-orange-600">
              Understand how static HTML becomes interactive through hydration.
            </p>
          </Link>

          <Link
            href="/learning/database-auth"
            className="bg-indigo-50 hover:bg-indigo-100 p-6 rounded-lg border border-indigo-200 transition-colors"
          >
            <h2 className="text-xl font-semibold text-indigo-800 mb-2">
              📱 Phone Authentication
            </h2>
            <p className="text-indigo-600">
              Learn phone number authentication with SMS magic codes, user onboarding, and modern database architecture.
            </p>
          </Link>

          <Link
            href="/learning/standalone-scripts"
            className="bg-emerald-50 hover:bg-emerald-100 p-6 rounded-lg border border-emerald-200 transition-colors"
          >
            <h2 className="text-xl font-semibold text-emerald-800 mb-2">
              🛠️ Standalone Scripts
            </h2>
            <p className="text-emerald-600">
              Build CLI tools and standalone scripts that work without the server, perfect for seeding and automation.
            </p>
          </Link>

          <Link
            href="/learning/real-time-data"
            className="bg-rose-50 hover:bg-rose-100 p-6 rounded-lg border border-rose-200 transition-colors"
          >
            <h2 className="text-xl font-semibold text-rose-800 mb-2">
              📊 Real-time Data
            </h2>
            <p className="text-rose-600">
              Master real-time data patterns, WebSocket connections, smart caching, and performance optimization.
            </p>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
            🚀 Next.js 16 Features (Coming Soon)
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This learning lab is being built in public as part of a real Apple Sports clone project.
            New features and learnings are added as we implement them.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded border">
              <h3 className="font-semibold mb-2">🎯 Cache Components</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Learn the new "use cache" directive for optimizing component performance
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded border">
              <h3 className="font-semibold mb-2">⚡ Turbopack</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Experience 5-10x faster builds and hot reload in development
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded border">
              <h3 className="font-semibold mb-2">🔄 Enhanced Routing</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Layout deduplication and smarter prefetch cache management
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded border">
              <h3 className="font-semibold mb-2">🏃 React Activity</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Background component rendering for improved UX
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🏈 Explore the Sports App →
          </Link>
        </div>
      </main>
    </div>
  );
}