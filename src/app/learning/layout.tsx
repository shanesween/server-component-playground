import Link from "next/link";

export default function LearningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <nav className="border-b bg-white dark:bg-gray-900 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold hover:text-blue-600">
              ← Back to Sports App
            </Link>
            <div className="flex items-center space-x-6">
              <Link href="/learning" className="hover:text-blue-600">Learning Home</Link>
              <Link href="/learning/server-components" className="hover:text-blue-600">Server Components</Link>
              <Link href="/learning/client-components" className="hover:text-blue-600">Client Components</Link>
              <Link href="/learning/data-fetching" className="hover:text-blue-600">Data Fetching</Link>
              <Link href="/learning/hydration" className="hover:text-blue-600">Hydration</Link>
              <Link href="/learning/database-auth" className="hover:text-blue-600">Database & Auth</Link>
              <Link href="/learning/standalone-scripts" className="hover:text-blue-600">Standalone Scripts</Link>
              <Link href="/learning/real-time-data" className="hover:text-blue-600">Real-time Data</Link>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}