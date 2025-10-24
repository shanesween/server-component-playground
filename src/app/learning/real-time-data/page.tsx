'use client';

import { useState, useEffect } from 'react';

export default function RealTimeDataLearning() {
    const [liveData, setLiveData] = useState<any>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    useEffect(() => {
        // Simulate real-time data updates
        const interval = setInterval(() => {
            setLiveData({
                games: [
                    { home: 'Chiefs', away: 'Bills', homeScore: 24, awayScore: 21, quarter: '4th', time: '2:34' },
                    { home: 'Cowboys', away: 'Eagles', homeScore: 14, awayScore: 17, quarter: '3rd', time: '8:45' },
                    { home: '49ers', away: 'Rams', homeScore: 28, awayScore: 14, quarter: '4th', time: '0:12' }
                ],
                lastUpdated: new Date().toISOString()
            });
            setLastUpdate(new Date());
        }, 5000);

        setIsConnected(true);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="max-w-6xl mx-auto p-8">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    📊 Real-time Data & Caching Architecture
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Learn how to build real-time sports data systems with smart caching, WebSocket connections, and performance optimization.
                </p>
            </div>

            {/* Live Data Demo */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    🎮 Live Data Demo
                </h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Live Sports Scores</h3>
                        <div className="flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {isConnected ? 'Connected' : 'Disconnected'}
                            </span>
                            {lastUpdate && (
                                <span className="text-xs text-gray-500">
                                    Last update: {lastUpdate.toLocaleTimeString()}
                                </span>
                            )}
                        </div>
                    </div>

                    {liveData && (
                        <div className="space-y-3">
                            {liveData.games.map((game: any, index: number) => (
                                <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="text-center">
                                                <div className="font-semibold">{game.away}</div>
                                                <div className="text-2xl font-bold text-blue-600">{game.awayScore}</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm text-gray-500">VS</div>
                                                <div className="text-xs text-gray-400">{game.quarter} {game.time}</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="font-semibold">{game.home}</div>
                                                <div className="text-2xl font-bold text-red-600">{game.homeScore}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-green-600">● LIVE</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Architecture Overview */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    🏗️ Real-time Architecture
                </h2>
                <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-lg mb-6">
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-blue-800 dark:text-blue-200">
                                Data Sources
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <li>• <strong>Sports APIs</strong> - ESPN, NFL.com, etc.</li>
                                <li>• <strong>WebSocket streams</strong> - Real-time updates</li>
                                <li>• <strong>Database cache</strong> - Local data storage</li>
                                <li>• <strong>CDN caching</strong> - Global distribution</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-green-800 dark:text-green-200">
                                Caching Strategy
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <li>• <strong>Smart invalidation</strong> - Game state changes</li>
                                <li>• <strong>TTL management</strong> - Time-based expiration</li>
                                <li>• <strong>Edge caching</strong> - Geographic distribution</li>
                                <li>• <strong>Database caching</strong> - Query optimization</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-purple-800 dark:text-purple-200">
                                Performance
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                                <li>• <strong>Connection pooling</strong> - Efficient connections</li>
                                <li>• <strong>Data compression</strong> - Reduced bandwidth</li>
                                <li>• <strong>Batch updates</strong> - Reduced API calls</li>
                                <li>• <strong>Lazy loading</strong> - On-demand data</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Caching Patterns */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    🚀 Caching Patterns
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-200">
                            Server-Side Caching
                        </h3>
                        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                            {`// Next.js 16 Cache Components
import { cache } from 'react';

const getGameData = cache(async (gameId: string) => {
  const response = await fetch(\`/api/games/\${gameId}\`, {
    next: { 
      revalidate: 30, // 30 seconds
      tags: ['games', gameId]
    }
  });
  return response.json();
});

// Usage in Server Component
export default async function GamePage({ gameId }: { gameId: string }) {
  const game = await getGameData(gameId);
  return <GameDisplay game={game} />;
}`}
                        </pre>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-200">
                            Client-Side Caching
                        </h3>
                        <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                            {`// React Query for client caching
import { useQuery } from '@tanstack/react-query';

function useGameData(gameId: string) {
  return useQuery({
    queryKey: ['game', gameId],
    queryFn: () => fetchGame(gameId),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 5 * 1000, // 5 seconds
    refetchIntervalInBackground: true
  });
}

// Usage in Client Component
function GameComponent({ gameId }: { gameId: string }) {
  const { data: game, isLoading } = useGameData(gameId);
  
  if (isLoading) return <GameSkeleton />;
  return <GameDisplay game={game} />;
}`}
                        </pre>
                    </div>
                </div>
            </section>

            {/* WebSocket Implementation */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    🔌 WebSocket Implementation
                </h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4 text-purple-800 dark:text-purple-200">
                        Real-time Connection Management
                    </h3>
                    <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                        {`// WebSocket hook for real-time updates
function useWebSocket(url: string) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    
    ws.onopen = () => {
      setIsConnected(true);
      setSocket(ws);
    };
    
    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData(newData);
    };
    
    ws.onclose = () => {
      setIsConnected(false);
      setSocket(null);
    };

    return () => ws.close();
  }, [url]);

  return { socket, isConnected, data };
}

// Usage in component
function LiveScores() {
  const { isConnected, data } = useWebSocket('wss://api.sports.com/live');
  
  return (
    <div>
      <div className={\`status \${isConnected ? 'connected' : 'disconnected'}\`}>
        {isConnected ? '● LIVE' : '● OFFLINE'}
      </div>
      {data?.games.map(game => <GameCard key={game.id} game={game} />)}
    </div>
  );
}`}
                    </pre>
                </div>
            </section>

            {/* Performance Optimization */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    ⚡ Performance Optimization
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4 text-orange-800 dark:text-orange-200">
                            Data Optimization
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                            <li>• <strong>Selective updates</strong> - Only changed data</li>
                            <li>• <strong>Data compression</strong> - Gzip/Brotli</li>
                            <li>• <strong>Pagination</strong> - Load data in chunks</li>
                            <li>• <strong>Field selection</strong> - Only needed fields</li>
                        </ul>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-200">
                            Network Optimization
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                            <li>• <strong>Connection pooling</strong> - Reuse connections</li>
                            <li>• <strong>Batch requests</strong> - Multiple updates at once</li>
                            <li>• <strong>Debouncing</strong> - Prevent excessive updates</li>
                            <li>• <strong>Throttling</strong> - Rate limit updates</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Database Caching */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    🗄️ Database Caching Strategy
                </h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4 text-indigo-800 dark:text-indigo-200">
                        Multi-Layer Caching
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
                            <h4 className="font-semibold text-blue-800 dark:text-blue-200">L1: Memory Cache</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">In-memory caching for instant access</p>
                        </div>
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded">
                            <h4 className="font-semibold text-green-800 dark:text-green-200">L2: Database Cache</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Pre-computed views and materialized data</p>
                        </div>
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded">
                            <h4 className="font-semibold text-purple-800 dark:text-purple-200">L3: CDN Cache</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Global edge caching for worldwide access</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Learnings */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
                    🎯 Key Learnings
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-200">
                            Real-time Patterns
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                            <li>• <strong>WebSocket connections</strong> - Persistent real-time updates</li>
                            <li>• <strong>Server-Sent Events</strong> - One-way real-time communication</li>
                            <li>• <strong>Polling strategies</strong> - Fallback for WebSocket failures</li>
                            <li>• <strong>Connection management</strong> - Handle disconnections gracefully</li>
                        </ul>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4 text-green-800 dark:text-green-200">
                            Caching Strategies
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                            <li>• <strong>Cache invalidation</strong> - Smart cache updates</li>
                            <li>• <strong>TTL management</strong> - Time-based expiration</li>
                            <li>• <strong>Cache warming</strong> - Pre-populate frequently accessed data</li>
                            <li>• <strong>Cache hierarchies</strong> - Multiple cache layers</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}
