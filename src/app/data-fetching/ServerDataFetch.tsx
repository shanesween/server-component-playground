// Server Component - fetches data at build time or request time
async function fetchServerData() {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    posts: [
      { id: 1, title: "Server-side Post 1", content: "This was fetched on the server" },
      { id: 2, title: "Server-side Post 2", content: "Available immediately in HTML" },
      { id: 3, title: "Server-side Post 3", content: "Great for SEO!" }
    ],
    fetchTime: new Date().toISOString(),
    source: 'server'
  };
}

export default async function ServerDataFetch() {
  const data = await fetchServerData();
  
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <div className="mb-3">
        <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
          SERVER COMPONENT
        </span>
        <p className="text-xs text-blue-600 mt-1">
          Fetched at: {data.fetchTime}
        </p>
      </div>
      
      <div className="space-y-3">
        {data.posts.map(post => (
          <div key={post.id} className="bg-white p-3 rounded border">
            <h4 className="font-medium">{post.title}</h4>
            <p className="text-sm text-gray-600">{post.content}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-blue-500">
        ✅ This data is in the initial HTML response
      </div>
    </div>
  );
}