"use client";

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  
  // Fix theme handling - ensure it's consistent
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Apply theme based on preference
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col">
      <main className="flex-1">{children}</main>
    </div>
  );
}
