'use client';

import { useState, useEffect } from 'react';
import Skeleton from './Skeleton';

interface RealTimeData {
  timestamp: string;
  value: number;
  status: 'connected' | 'disconnected' | 'connecting';
  updateCount: number;
}

interface Props {
  initialData: {
    timestamp: string;
    value: number;
  };
}

export default function RealTimeDemo({ initialData }: Props) {
  const [data, setData] = useState<RealTimeData>({
    ...initialData,
    status: 'connecting',
    updateCount: 0
  });

  useEffect(() => {
    // Simulate real-time updates (in real app, this would be WebSocket, SSE, etc.)
    setData(prev => ({ ...prev, status: 'connected' }));
    
    const interval = setInterval(() => {
      setData(prev => ({
        timestamp: new Date().toISOString(),
        value: Math.floor(Math.random() * 1000),
        status: 'connected',
        updateCount: prev.updateCount + 1
      }));
    }, 2000); // Update every 2 seconds

    // Simulate occasional connection issues
    const connectionIssues = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance
        setData(prev => ({ ...prev, status: 'disconnected' }));
        setTimeout(() => {
          setData(prev => ({ ...prev, status: 'connected' }));
        }, 1000);
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(connectionIssues);
    };
  }, []);

  const getStatusColor = () => {
    switch (data.status) {
      case 'connected': return 'text-green-600';
      case 'disconnected': return 'text-red-600';
      case 'connecting': return 'text-yellow-600';
    }
  };

  const getStatusIcon = () => {
    switch (data.status) {
      case 'connected': return '🟢';
      case 'disconnected': return '🔴';
      case 'connecting': return '🟡';
    }
  };

  // Show skeleton while connecting (first few seconds)
  if (data.status === 'connecting' && data.updateCount === 0) {
    return <Skeleton variant="hybrid" title="CONNECTING..." />;
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border-l-4 border-green-500">
      <div className="mb-3 flex justify-between items-center">
        <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
          HYBRID: SERVER + CLIENT
        </span>
        <div className={`text-sm font-medium ${getStatusColor()}`}>
          {getStatusIcon()} {data.status.toUpperCase()}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium text-green-800 mb-2">Real-Time Data Stream</h4>
          <div className="text-sm space-y-1">
            <p><strong>Initial Value:</strong> {initialData.value} (from server)</p>
            <p><strong>Current Value:</strong> {data.value} (live updates)</p>
            <p><strong>Last Update:</strong> {data.timestamp}</p>
            <p><strong>Updates Received:</strong> {data.updateCount}</p>
          </div>
        </div>

        <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
          <h5 className="font-medium text-yellow-800 text-sm mb-1">How This Works:</h5>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>1. Server Component provides initial data in HTML</li>
            <li>2. Client Component takes over for real-time updates</li>
            <li>3. WebSocket/SSE/polling handles live data stream</li>
            <li>4. Best of both: Fast initial load + live updates</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-green-600">
        ⚡ This simulates WebSocket/SSE real-time updates every 2 seconds
      </div>
    </div>
  );
}