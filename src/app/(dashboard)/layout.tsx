import Link from "next/link";
import { getActiveSports } from "@/lib/sports/config";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const activeSports = getActiveSports();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Top Navigation */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">Sports</span>
            </Link>

            {/* Sport Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {activeSports.map((sport) => (
                <Link
                  key={sport.id}
                  href={`/${sport.id}`}
                  className="flex items-center space-x-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                >
                  <span className="text-lg">{sport.icon}</span>
                  <span className="font-medium">{sport.displayName}</span>
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Link
                href="/learning"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white text-sm"
              >
                Learning
              </Link>
              <Link
                href="/auth/signin"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-4 py-2">
          <Link
            href="/"
            className="flex flex-col items-center py-2 px-1 text-slate-600 dark:text-slate-400"
          >
            <span className="text-xl mb-1">🏠</span>
            <span className="text-xs font-medium">Home</span>
          </Link>
          {activeSports.map((sport) => (
            <Link
              key={sport.id}
              href={`/${sport.id}`}
              className="flex flex-col items-center py-2 px-1 text-slate-600 dark:text-slate-400"
            >
              <span className="text-xl mb-1">{sport.icon}</span>
              <span className="text-xs font-medium">{sport.displayName}</span>
            </Link>
          ))}
          <Link
            href="/favorites"
            className="flex flex-col items-center py-2 px-1 text-slate-600 dark:text-slate-400"
          >
            <span className="text-xl mb-1">⭐</span>
            <span className="text-xs font-medium">Favorites</span>
          </Link>
        </div>
      </nav>

      {/* Add padding bottom for mobile nav */}
      <div className="h-16 md:h-0" />
    </div>
  );
}