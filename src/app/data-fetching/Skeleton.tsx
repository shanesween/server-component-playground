interface SkeletonProps {
  variant: 'server' | 'client' | 'hybrid';
  title?: string;
}

export default function Skeleton({ variant, title }: SkeletonProps) {
  const getColors = () => {
    switch (variant) {
      case 'server': return 'bg-blue-50 border-blue-200';
      case 'client': return 'bg-purple-50 border-purple-200';
      case 'hybrid': return 'bg-green-50 border-green-200';
    }
  };

  const getBadgeColor = () => {
    switch (variant) {
      case 'server': return 'bg-blue-600';
      case 'client': return 'bg-purple-600';
      case 'hybrid': return 'bg-green-600';
    }
  };

  const getLoadingText = () => {
    switch (variant) {
      case 'server': return 'Loading server data...';
      case 'client': return 'Loading client data...';
      case 'hybrid': return 'Loading initial data...';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getColors()}`}>
      <div className="animate-pulse">
        {/* Header with badge */}
        <div className="flex justify-between items-start mb-3">
          <div className={`${getBadgeColor()} text-white px-2 py-1 rounded text-xs`}>
            {title || variant.toUpperCase()}
          </div>
          <div className="w-16 h-4 bg-gray-200 rounded"></div>
        </div>

        {/* Timestamp skeleton */}
        <div className="w-32 h-3 bg-gray-200 rounded mb-4"></div>

        {/* Content skeletons */}
        <div className="space-y-3">
          <div className="bg-white p-3 rounded border">
            <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
            <div className="w-full h-3 bg-gray-100 rounded"></div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="w-2/3 h-4 bg-gray-200 rounded mb-2"></div>
            <div className="w-5/6 h-3 bg-gray-100 rounded"></div>
          </div>
          <div className="bg-white p-3 rounded border">
            <div className="w-4/5 h-4 bg-gray-200 rounded mb-2"></div>
            <div className="w-3/4 h-3 bg-gray-100 rounded"></div>
          </div>
        </div>

        {/* Footer skeleton */}
        <div className="mt-3 w-48 h-3 bg-gray-200 rounded"></div>
      </div>
      
      <p className="text-sm mt-2 opacity-75">
        {getLoadingText()}
      </p>
    </div>
  );
}