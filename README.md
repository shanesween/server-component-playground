# Server Components & SSR Playground

This is a [Next.js](https://nextjs.org) project designed to help you understand Server Components and Server-Side Rendering concepts through practical examples.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## What Each Demo Shows

### `/server-components` - Demonstrates React Server Components:
- Components that run on the server and render to HTML
- Can directly access databases/APIs without client-side fetching
- Send only HTML to browser (no JavaScript for the component itself)
- Uses `async/await` directly in components

### `/client-components` - Shows traditional Client Components:
- Must have `'use client'` directive
- Run in browser after hydration
- Can use hooks, event handlers, browser APIs
- Interactive and respond to user events

### `/data-fetching` - Compares RSC vs Client data patterns:
- Server side: Data fetched during render, available in initial HTML
- Client side: Data fetched after page loads, requires loading states

### `/hydration` - Demonstrates the SSR → Interactive transition:
- Shows how server-rendered HTML becomes interactive
- Visualizes the hydration process with status indicators

## React Server Components vs SSR

Understanding the key difference between traditional SSR and React Server Components:

### Traditional SSR (Server-Side Rendering):
- Renders React components to HTML on the server
- Sends HTML + JavaScript to client
- Client re-renders the same components for hydration
- **Same code runs twice** (server + client)

### React Server Components (RSC):
- Components run **only** on the server
- Send rendered HTML (not JavaScript) to client
- **Never run on the client** - no hydration for server components
- Can mix server components (no JS) + client components (with JS)

## Important Notes

All examples in this playground use **React Server Components**! Next.js App Router defaults to RSC. Notice in `/server-components/page.tsx` there's no `'use client'` - it's a true server component that never runs in the browser.

The `/server-components` demo shows pure RSC, while `/client-components` shows components that need `'use client'` to run in the browser. Next.js intelligently sends only the client component JavaScript to the browser, not the server component code.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
