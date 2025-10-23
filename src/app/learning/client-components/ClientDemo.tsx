'use client';

// This is a CLIENT COMPONENT
// - Must have "use client" directive at the top
// - Runs in the browser after hydration
// - Can use hooks, event handlers, and browser APIs
// - Interactive and can respond to user events

import { useState, useEffect } from 'react';

export default function ClientDemo() {
  const [count, setCount] = useState(0);
  const [clientTime, setClientTime] = useState<string>('');
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // This runs in the browser
    setClientTime(new Date().toISOString());
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClick = () => {
    setCount(prev => prev + 1);
    setClientTime(new Date().toISOString());
  };

  return (
    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
      <h3 className="font-semibold text-purple-800">Client Component Demo:</h3>
      
      <div className="mt-4 space-y-3">
        <div className="bg-white p-3 rounded">
          <p className="text-sm text-purple-600">Hydrated at: {clientTime}</p>
          <p className="text-sm text-purple-600">Window width: {windowWidth}px</p>
        </div>

        <button 
          onClick={handleClick}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
        >
          Click me! Count: {count}
        </button>

        <div className="text-xs text-purple-500">
          ⚡ This is interactive and runs in the browser
        </div>
      </div>
    </div>
  );
}