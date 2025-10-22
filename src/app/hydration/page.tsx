import HydrationDemo from './HydrationDemo';

export default function HydrationPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Hydration Demo</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">What is Hydration?</h2>
          <p className="text-gray-700 mb-3">
            Hydration is the process where React takes the static HTML generated on the server 
            and "brings it to life" by attaching event listeners and making it interactive.
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>• Server sends static HTML (fast initial render)</li>
            <li>• Client downloads React JavaScript</li>
            <li>• React "hydrates" the static HTML</li>
            <li>• Components become interactive</li>
          </ul>
        </div>

        <HydrationDemo />

        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
          <h3 className="font-semibold text-orange-800">Hydration Process:</h3>
          <ol className="text-orange-700 mt-2 space-y-1 list-decimal list-inside">
            <li>Server renders component to HTML</li>
            <li>HTML is sent to browser (page appears instantly)</li>
            <li>React JavaScript downloads and executes</li>
            <li>React matches the DOM and attaches event handlers</li>
            <li>Component becomes fully interactive</li>
          </ol>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
          <h3 className="font-semibold text-red-800">Hydration Mismatches:</h3>
          <p className="text-red-700 mt-2 text-sm">
            If server-rendered HTML doesn't match what React expects on the client, 
            you'll get hydration warnings. Common causes:
          </p>
          <ul className="text-red-700 mt-2 space-y-1 text-sm">
            <li>• Different content between server and client</li>
            <li>• Using browser-only APIs during SSR</li>
            <li>• Random values or timestamps</li>
            <li>• Third-party scripts modifying DOM</li>
          </ul>
        </div>
      </div>
    </div>
  );
}