'use client';

import { useState, useEffect } from 'react';

export default function HydrationDemo() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [serverTime] = useState(() => new Date().toISOString());
  const [clientTime, setClientTime] = useState<string>('');

  useEffect(() => {
    // This only runs on the client after hydration
    setIsHydrated(true);
    setClientTime(new Date().toISOString());
  }, []);

  const handleClick = () => {
    setClicks(prev => prev + 1);
  };

  return (
    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
      <h3 className="font-semibold text-green-800 mb-4">Hydration Status Demo</h3>
      
      <div className="space-y-4">
        <div className="bg-white p-3 rounded border">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${isHydrated ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="font-medium">
              Hydration Status: {isHydrated ? 'Hydrated ✅' : 'Not Hydrated Yet ⏳'}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Server rendered at: {serverTime}
          </p>
          {clientTime && (
            <p className="text-sm text-gray-600">
              Client hydrated at: {clientTime}
            </p>
          )}
        </div>

        <div className="bg-white p-3 rounded border">
          <p className="mb-2">This button becomes interactive after hydration:</p>
          <button 
            onClick={handleClick}
            disabled={!isHydrated}
            className={`px-4 py-2 rounded transition-colors ${
              isHydrated 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Clicks: {clicks} {!isHydrated && '(Button will work after hydration)'}
          </button>
        </div>

        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium mb-2">What you see:</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>1. Page appears instantly (server-rendered HTML)</li>
            <li>2. Button is visible but disabled initially</li>
            <li>3. After hydration, button becomes interactive</li>
            <li>4. Green dot turns on when fully hydrated</li>
          </ul>
        </div>
      </div>
    </div>
  );
}