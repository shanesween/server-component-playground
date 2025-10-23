import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <h1 className="text-white font-semibold text-xl">Sports</h1>
            </div>
            <nav className="flex items-center space-x-6">
              <Link href="/learning" className="text-white/70 hover:text-white transition-colors">
                Learning Lab
              </Link>
              <Link href="/auth/signin" className="text-white/70 hover:text-white transition-colors">
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Live Sports
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}Scores
              </span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Stay up to date with live NFL and MLB scores, standings, and team stats. 
              Built with Next.js 16 and showcasing modern web development patterns.
            </p>
          </div>

          {/* Sport Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Link 
              href="/nfl"
              className="group relative bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 hover:from-blue-600/30 hover:to-blue-800/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">NFL</h2>
                <span className="text-4xl">🏈</span>
              </div>
              <p className="text-white/70 mb-4">
                Live scores, standings, and team stats for all NFL games
              </p>
              <div className="flex items-center text-blue-400 group-hover:text-blue-300">
                <span>View NFL Dashboard</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>

            <Link 
              href="/mlb"
              className="group relative bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 hover:from-green-600/30 hover:to-green-800/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">MLB</h2>
                <span className="text-4xl">⚾</span>
              </div>
              <p className="text-white/70 mb-4">
                Follow your favorite teams and track live baseball action
              </p>
              <div className="flex items-center text-green-400 group-hover:text-green-300">
                <span>View MLB Dashboard</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          </div>

          {/* Features */}
          <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              Powered by Next.js 16
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="font-semibold text-white mb-2">Real-time Updates</h4>
                <p className="text-white/70 text-sm">Live scores with 15-second refresh using cache components</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="font-semibold text-white mb-2">Smart Caching</h4>
                <p className="text-white/70 text-sm">Optimized performance with "use cache" and Suspense</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h4 className="font-semibold text-white mb-2">Mobile First</h4>
                <p className="text-white/70 text-sm">Responsive design optimized for mobile viewing</p>
              </div>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="mt-12 text-center">
            <p className="text-white/50 text-sm mb-4">
              🚧 Built in public - New features added weekly
            </p>
            <Link 
              href="/learning"
              className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-lg transition-colors"
            >
              📚 Learn how it's built
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
