  // providers.tsx
  "use client";
  import { BrowserRouter } from 'react-router-dom';

  export function SideWrapper({ children }: { children: React.ReactNode }) {
    return <BrowserRouter>{children}</BrowserRouter>;
  }