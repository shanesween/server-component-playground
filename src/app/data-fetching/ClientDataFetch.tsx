'use client';

import { useState, useEffect } from 'react';
import Skeleton from './Skeleton';

interface Post {
  id: number;
  title: string;
  content: string;
}

interface ClientData {
  posts: Post[];
  fetchTime: string;
  source: string;
}

// Simulate a client-side API call
async function fetchClientData(): Promise<ClientData> {
  // Slightly longer delay to demonstrate client-side loading states are more visible
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  return {
    posts: [
      { id: 1, title: "Client-side Post 1", content: "This was fetched in the browser" },
      { id: 2, title: "Client-side Post 2", content: "Loaded after page hydration" },
      { id: 3, title: "Client-side Post 3", content: "Can be refetched dynamically" }
    ],
    fetchTime: new Date().toISOString(),
    source: 'client'
  };
}

export default function ClientDataFetch() {
  const [data, setData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refetchCount, setRefetchCount] = useState(0);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await fetchClientData();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [refetchCount]);

  const handleRefetch = () => {
    setRefetchCount(prev => prev + 1);
  };

  if (loading) {
    return <Skeleton variant="client" />;
  }

  return (
    <div className="bg-purple-50 p-4 rounded-lg">
      <div className="mb-3 flex justify-between items-start">
        <div>
          <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs">
            CLIENT COMPONENT
          </span>
          <p className="text-xs text-purple-600 mt-1">
            Fetched at: {data?.fetchTime}
          </p>
        </div>
        <button 
          onClick={handleRefetch}
          className="bg-purple-600 text-white px-2 py-1 rounded text-xs hover:bg-purple-700"
        >
          Refetch
        </button>
      </div>
      
      <div className="space-y-3">
        {data?.posts.map(post => (
          <div key={post.id} className="bg-white p-3 rounded border">
            <h4 className="font-medium">{post.title}</h4>
            <p className="text-sm text-gray-600">{post.content}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-purple-500">
        ⚡ This data was fetched after page load (refetch count: {refetchCount})
      </div>
    </div>
  );
}