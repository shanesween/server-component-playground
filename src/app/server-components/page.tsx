// This is a SERVER COMPONENT (default in App Router)
// - Runs on the server during build time or request time
// - Can directly access databases, file systems, etc.
// - Cannot use browser APIs, event handlers, or hooks
// - HTML is generated on server and sent to client

import { Suspense } from 'react';

// Simulate a database call
async function getServerData() {
  // Simulate typical database query time - consistent across all server components
  await new Promise(resolve => setTimeout(resolve, 800));
  return {
    timestamp: new Date().toISOString(),
    serverInfo: 'This data was fetched on the server!',
    randomNumber: Math.floor(Math.random() * 1000)
  };
}

// Another async server component
async function ServerDataDisplay() {
  const data = await getServerData();
  
  return (
    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
      <h3 className="font-semibold text-blue-800">Server Component Data:</h3>
      <p className="text-sm text-blue-600">Rendered at: {data.timestamp}</p>
      <p>{data.serverInfo}</p>
      <p>Random number: {data.randomNumber}</p>
      <p className="text-xs text-blue-500 mt-2">
        ✅ This was rendered on the server and sent as HTML
      </p>
    </div>
  );
}

export default function ServerComponentsPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Server Components Demo</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">What are Server Components?</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• Run on the server during build time or request time</li>
            <li>• Can access databases, file systems, and server-only APIs</li>
            <li>• Cannot use browser APIs, event handlers, or React hooks</li>
            <li>• Send rendered HTML to the client (not JavaScript)</li>
            <li>• Default behavior in Next.js App Router</li>
          </ul>
        </div>

        <Suspense fallback={
          <div className="bg-gray-100 p-4 rounded-lg animate-pulse">
            Loading server data...
          </div>
        }>
          <ServerDataDisplay />
        </Suspense>

        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
          <h3 className="font-semibold text-green-800">Benefits:</h3>
          <ul className="text-green-700 mt-2 space-y-1">
            <li>• Faster initial page load (HTML ready immediately)</li>
            <li>• Better SEO (content is in HTML)</li>
            <li>• Reduced bundle size (server code doesn't go to client)</li>
            <li>• Direct database access without API routes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}