import { Suspense } from 'react';
import LiveScores from '@/components/sports/LiveScores';
import { TeamsGrid, TeamsGridLoading } from '@/components/sports/TeamCard';
import { Separator } from '@/components/ui/separator';

export default function MLBDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <span className="text-4xl">⚾</span>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">MLB</h1>
        </div>
        <p className="text-slate-600 dark:text-slate-400">
          Live scores, standings, and team stats for Major League Baseball
        </p>
      </div>

      {/* Live Scores Section */}
      <section className="mb-8">
        <LiveScores sport="mlb" />
      </section>

      <Separator className="my-8" />

      {/* Teams Section */}
      <section>
        <div className="flex items-center space-x-2 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            All Teams
          </h2>
          <span className="text-sm text-slate-600 dark:text-slate-400">
            2024 Season
          </span>
        </div>
        
        <Suspense fallback={<TeamsGridLoading />}>
          <TeamsGrid sport="mlb" />
        </Suspense>
      </section>

      {/* Coming Soon Sections */}
      <div className="mt-12 space-y-6">
        <Separator />
        
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            🚧 Coming Soon
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            More features being built in public
          </p>
          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
              <h4 className="font-medium mb-1">Standings</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                League and division standings
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
              <h4 className="font-medium mb-1">Player Stats</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Batting and pitching stats
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border">
              <h4 className="font-medium mb-1">Schedule</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Upcoming games and results
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}