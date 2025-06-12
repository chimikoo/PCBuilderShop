"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Laptop, Menu, X, Moon, Sun, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { CartDropdown } from '@/components/ui/cart/cart-dropdown';
import { useState, useEffect } from 'react';

export function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Apply theme change consistently
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
  };

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <header className={`sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur transition-all ${
      isScrolled ? 'shadow-sm' : ''
    }`}>
      <div className="container flex h-16 items-center">
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col space-y-4 py-4">
                <Link
                  href="/"
                  className="flex items-center px-2"
                  onClick={() => document.body.classList.remove('overflow-hidden')}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  <span className="font-bold">PCBuilderShop</span>
                </Link>
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/"
                    className={`flex items-center px-2 py-1 text-lg ${
                      pathname === '/' ? 'font-medium text-primary' : 'text-muted-foreground'
                    }`}
                    onClick={() => document.body.classList.remove('overflow-hidden')}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                  <Link
                    href="/products"
                    className={`flex items-center px-2 py-1 text-lg ${
                      pathname === '/products' || pathname.startsWith('/products/') 
                        ? 'font-medium text-primary' 
                        : 'text-muted-foreground'
                    }`}
                    onClick={() => document.body.classList.remove('overflow-hidden')}
                  >
                    <Laptop className="mr-2 h-4 w-4" />
                    Products
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <ShoppingBag className="mr-2 h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">PCBuilderShop</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Home
          </Link>
          <Link
            href="/products"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/products' || pathname.startsWith('/products/') 
                ? 'text-primary' 
                : 'text-muted-foreground'
            }`}
          >
            Products
          </Link>
        </nav>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          {/* Theme toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          {/* Cart dropdown */}
          <CartDropdown />
        </div>
      </div>
    </header>
  );
}
