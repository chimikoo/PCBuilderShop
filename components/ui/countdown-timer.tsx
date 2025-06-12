"use client";

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  endDate: Date;
  className?: string;
}

export function CountdownTimer({ endDate, className = '' }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const [isExpired, setIsExpired] = useState(false);
  
  // Debug logging for the endDate prop
  useEffect(() => {
    console.log('CountdownTimer received endDate:', endDate);
    console.log('Current time:', new Date());
    console.log('Is endDate valid?', endDate instanceof Date && !isNaN(endDate.getTime()));
    console.log('Time difference (ms):', endDate.getTime() - new Date().getTime());
  }, [endDate]);

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Ensure we have a valid date object
      if (!(endDate instanceof Date) || isNaN(endDate.getTime())) {
        console.error('Invalid end date provided to CountdownTimer');
        setIsExpired(false); // Default to not expired if date is invalid
        return {
          days: 7,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }
      
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();
      
      console.log(`Time difference: ${difference}ms, End date: ${endDate.toISOString()}, Now: ${now.toISOString()}`);
      
      if (difference <= 0) {
        setIsExpired(true);
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      } else {
        setIsExpired(false);
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };
    
    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    
    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    
    // Cleanup
    return () => clearInterval(timer);
  }, [endDate]);
  
  return (
    <div className={`flex items-center ${className}`}>
      <Clock className="w-4 h-4 mr-2 text-red-500" />
      <div className="text-sm font-medium">
        {isExpired ? (
          <span className="text-red-500">Deal Expired!</span>
        ) : (
          <div className="flex items-center space-x-1">
            <span className="font-bold">Ends in:</span>
            <div className="flex items-center space-x-1">
              <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-1 rounded">
                {timeLeft.days}d
              </span>
              <span>:</span>
              <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-1 rounded">
                {timeLeft.hours.toString().padStart(2, '0')}h
              </span>
              <span>:</span>
              <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-1 rounded">
                {timeLeft.minutes.toString().padStart(2, '0')}m
              </span>
              <span>:</span>
              <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-1 rounded">
                {timeLeft.seconds.toString().padStart(2, '0')}s
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
