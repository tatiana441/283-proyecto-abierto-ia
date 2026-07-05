import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/react'
import { esES } from '@clerk/localizations'
import './index.css'
import App from './App.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env.local')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const clerkProviderWrapper = ClerkProvider as any;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {React.createElement(
      clerkProviderWrapper,
      { publishableKey: PUBLISHABLE_KEY, localization: esES },
      <App />
    )}
  </StrictMode>,
)
