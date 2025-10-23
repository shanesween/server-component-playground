import { Suspense } from 'react';
import ServerDataFetch from './ServerDataFetch';
import ClientDataFetch from './ClientDataFetch';
import RealTimeDemo from './RealTimeDemo';
import Skeleton from './Skeleton';

async function getInitialRealTimeData() {
  // Same delay as other server components for fair comparison
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    timestamp: new Date().toISOString(),
    value: Math.floor(Math.random() * 1000)
  };
}

export default async function DataFetchingPage() {
  const initialRealTimeData = await getInitialRealTimeData();

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Data Fetching: Server vs Client</h1>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">Server-Side Fetching</h2>
          <Suspense fallback={<Skeleton variant="server" />}>
            <ServerDataFetch />
          </Suspense>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 text-purple-600">Client-Side Fetching</h2>
          <ClientDataFetch />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-green-600">Real-Time Updates (Hybrid Approach)</h2>
        <RealTimeDemo initialData={initialRealTimeData} />
      </div>

      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Data Fetching Patterns:</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-800">Server-Side Fetching</h4>
            <ul className="mt-2 text-blue-700 text-sm space-y-1">
              <li>• Data available on initial HTML</li>
              <li>• Better SEO (crawlers see content)</li>
              <li>• No loading state needed</li>
              <li>• Can access databases directly</li>
              <li>• Runs during build or request</li>
              <li>• ❌ No real-time updates</li>
            </ul>
          </div>

          <div className="bg-purple-50 p-4 rounded border-l-4 border-purple-500">
            <h4 className="font-semibold text-purple-800">Client-Side Fetching</h4>
            <ul className="mt-2 text-purple-700 text-sm space-y-1">
              <li>• Data loads after page loads</li>
              <li>• Loading states required</li>
              <li>• Can refetch/update dynamically</li>
              <li>• User interactions can trigger</li>
              <li>• Runs in the browser</li>
              <li>• ✅ Real-time updates possible</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded border-l-4 border-green-500">
            <h4 className="font-semibold text-green-800">Hybrid Approach</h4>
            <ul className="mt-2 text-green-700 text-sm space-y-1">
              <li>• Fast initial load (server)</li>
              <li>• Real-time updates (client)</li>
              <li>• Best of both worlds</li>
              <li>• Common pattern in production</li>
              <li>• WebSocket/SSE for live data</li>
              <li>• ✅ Performance + Interactivity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}