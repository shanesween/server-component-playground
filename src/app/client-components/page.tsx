import ClientDemo from './ClientDemo';

export default function ClientComponentsPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Client Components Demo</h1>

      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-3">What are Client Components?</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• Must include "use client" directive at the top</li>
            <li>• Run in the browser after hydration</li>
            <li>• Can use React hooks, event handlers, and browser APIs</li>
            <li>• Interactive and can respond to user events</li>
            <li>• JavaScript is sent to the client</li>
          </ul>
        </div>

        <ClientDemo />

        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
          <h3 className="font-semibold text-yellow-800">Trade-offs:</h3>
          <ul className="text-yellow-700 mt-2 space-y-1">
            <li>• Larger bundle size (JavaScript goes to client)</li>
            <li>• Slower initial render (needs hydration)</li>
            <li>• But enables interactivity and dynamic updates</li>
            <li>• Can use browser APIs and respond to events</li>
          </ul>
        </div>
      </div>
    </div>
  );
}