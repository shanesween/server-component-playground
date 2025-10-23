import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllTeams } from '@/lib/api/client';
import { getSportConfig } from '@/lib/sports/config';

// Loading skeleton for team cards
export function TeamCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="w-6 h-6" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <Skeleton className="h-3 w-8 mx-auto mb-1" />
            <Skeleton className="h-4 w-6 mx-auto" />
          </div>
          <div className="text-center">
            <Skeleton className="h-3 w-8 mx-auto mb-1" />
            <Skeleton className="h-4 w-6 mx-auto" />
          </div>
          <div className="text-center">
            <Skeleton className="h-3 w-12 mx-auto mb-1" />
            <Skeleton className="h-4 w-8 mx-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Mock team data for development
const mockTeams = [
  {
    id: '1',
    city: 'Kansas City',
    name: 'Chiefs',
    abbreviation: 'KC',
    conference: 'AFC',
    division: 'West',
    wins: 11,
    losses: 1,
    winPercentage: 0.917,
    logoUrl: '/teams/chiefs.png'
  },
  {
    id: '2',
    city: 'Buffalo',
    name: 'Bills',
    abbreviation: 'BUF',
    conference: 'AFC',
    division: 'East',
    wins: 10,
    losses: 2,
    winPercentage: 0.833,
    logoUrl: '/teams/bills.png'
  },
  {
    id: '3',
    city: 'Dallas',
    name: 'Cowboys',
    abbreviation: 'DAL',
    conference: 'NFC',
    division: 'East',
    wins: 8,
    losses: 4,
    winPercentage: 0.667,
    logoUrl: '/teams/cowboys.png'
  },
  {
    id: '4',
    city: 'Philadelphia',
    name: 'Eagles',
    abbreviation: 'PHI',
    conference: 'NFC',
    division: 'East',
    wins: 9,
    losses: 3,
    winPercentage: 0.750,
    logoUrl: '/teams/eagles.png'
  },
  {
    id: '5',
    city: 'San Francisco',
    name: '49ers',
    abbreviation: 'SF',
    conference: 'NFC',
    division: 'West',
    wins: 7,
    losses: 5,
    winPercentage: 0.583,
    logoUrl: '/teams/49ers.png'
  },
  {
    id: '6',
    city: 'Green Bay',
    name: 'Packers',
    abbreviation: 'GB',
    conference: 'NFC',
    division: 'North',
    wins: 6,
    losses: 6,
    winPercentage: 0.500,
    logoUrl: '/teams/packers.png'
  },
];

interface TeamCardProps {
  team: any;
  sport: string;
  isFavorite?: boolean;
}

// Individual team card component (cached)
async function TeamCard({ team, sport, isFavorite = false }: TeamCardProps) {
  const config = getSportConfig(sport);
  if (!config) return null;

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        {/* Team Header */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
            <span className="font-bold text-sm">{team.abbreviation}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {team.city} {team.name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {team.conference} {team.division}
            </p>
          </div>
          <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
            <span className={isFavorite ? "text-yellow-500" : "text-slate-400"}>
              ⭐
            </span>
          </button>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              Wins
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {team.wins}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              Losses
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {team.losses}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">
              Win %
            </p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              {team.winPercentage.toFixed(3)}
            </p>
          </div>
        </div>

        {/* Division Badge */}
        <div className="mt-3 flex justify-center">
          <Badge variant="outline" className="text-xs">
            {team.conference} {team.division}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

// Teams grid component with Suspense  
async function TeamsGrid({ sport }: { sport: string }) {
  // In production, use: const teams = await getAllTeams(sport);
  const teams = mockTeams;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {teams.map(team => (
        <TeamCard key={team.id} team={team} sport={sport} />
      ))}
    </div>
  );
}

export function TeamsGridLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <TeamCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default TeamCard;
export { TeamsGrid };