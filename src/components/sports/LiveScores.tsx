import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getLiveGames } from '@/lib/api/client';
import { getSportConfig } from '@/lib/sports/config';

// Loading skeleton component
function LiveScoresLoading() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Skeleton className="w-8 h-8 rounded" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-6 w-8" />
                <span className="text-slate-400">-</span>
                <Skeleton className="h-6 w-8" />
              </div>
              <div className="flex items-center space-x-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="w-8 h-8 rounded" />
              </div>
            </div>
            <div className="mt-3 flex justify-center">
              <Skeleton className="h-3 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Mock data for development (replace with real API calls)
const mockLiveGames = [
  {
    id: '1',
    homeTeam: { name: 'Chiefs', city: 'Kansas City', abbreviation: 'KC', logoUrl: '/teams/chiefs.png' },
    awayTeam: { name: 'Bills', city: 'Buffalo', abbreviation: 'BUF', logoUrl: '/teams/bills.png' },
    homeScore: 21,
    awayScore: 17,
    status: 'live',
    period: 3,
    timeRemaining: '8:43',
    venue: 'Arrowhead Stadium'
  },
  {
    id: '2',
    homeTeam: { name: 'Cowboys', city: 'Dallas', abbreviation: 'DAL', logoUrl: '/teams/cowboys.png' },
    awayTeam: { name: 'Eagles', city: 'Philadelphia', abbreviation: 'PHI', logoUrl: '/teams/eagles.png' },
    homeScore: 14,
    awayScore: 10,
    status: 'live',
    period: 2,
    timeRemaining: '2:15',
    venue: 'AT&T Stadium'
  },
  {
    id: '3',
    homeTeam: { name: 'Packers', city: 'Green Bay', abbreviation: 'GB', logoUrl: '/teams/packers.png' },
    awayTeam: { name: 'Bears', city: 'Chicago', abbreviation: 'CHI', logoUrl: '/teams/bears.png' },
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    period: 0,
    timeRemaining: '8:20 PM ET',
    venue: 'Lambeau Field'
  }
];

// Server Component that fetches live data
async function LiveScoresContent({ sport }: { sport: string }) {
  const config = getSportConfig(sport);
  if (!config) return <div>Sport not found</div>;

  // For development, use mock data
  // In production, uncomment the line below:
  // const games = await getLiveGames(sport);
  const games = mockLiveGames;
  
  if (!games || games.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-4xl mb-2">{config.icon}</div>
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">No Live Games</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Check back later for live {config.displayName} action!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {games.map(game => (
        <Card key={game.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              {/* Away Team */}
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">{game.awayTeam.abbreviation}</span>
                </div>
                <div className="text-left">
                  <div className="font-medium text-slate-900 dark:text-white">
                    {game.awayTeam.city}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {game.awayTeam.name}
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="flex items-center space-x-4 px-4">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {game.awayScore}
                </div>
                <span className="text-slate-400">-</span>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {game.homeScore}
                </div>
              </div>

              {/* Home Team */}
              <div className="flex items-center space-x-3 flex-1 justify-end">
                <div className="text-right">
                  <div className="font-medium text-slate-900 dark:text-white">
                    {game.homeTeam.city}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    {game.homeTeam.name}
                  </div>
                </div>
                <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center">
                  <span className="text-xs font-bold">{game.homeTeam.abbreviation}</span>
                </div>
              </div>
            </div>

            {/* Game Status */}
            <div className="mt-3 flex justify-center items-center space-x-2">
              {game.status === 'live' ? (
                <>
                  <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    Q{game.period} - {game.timeRemaining}
                  </span>
                </>
              ) : game.status === 'scheduled' ? (
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {game.timeRemaining}
                </span>
              ) : (
                <Badge variant="secondary">FINAL</Badge>
              )}
            </div>

            {/* Venue */}
            <div className="mt-2 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {game.venue}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Main component with Suspense boundary
export default function LiveScores({ sport }: { sport: string }) {
  const config = getSportConfig(sport);
  
  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-2xl">{config?.icon}</span>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Live {config?.displayName} Games
        </h2>
      </div>
      
      <Suspense fallback={<LiveScoresLoading />}>
        <LiveScoresContent sport={sport} />
      </Suspense>
    </div>
  );
}