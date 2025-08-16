import { useState, useEffect } from 'react';
import { X, Zap, Gift, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const BlackFridayBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Check if it's Black Friday season (November 20-30)
    const now = new Date();
    const isBlackFridaySeason = now.getMonth() === 10 && now.getDate() >= 20 && now.getDate() <= 30;
    
    if (!isBlackFridaySeason) {
      setIsVisible(false);
      return;
    }

    const blackFridayEnd = new Date(now.getFullYear(), 10, 30, 23, 59, 59);
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = blackFridayEnd.getTime() - now;
      
      if (distance < 0) {
        setIsVisible(false);
        return;
      }
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-blackfriday text-blackfriday-text shadow-blackfriday overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-blackfriday-accent rounded-full animate-float opacity-20"></div>
        <div className="absolute top-1/2 right-1/4 w-6 h-6 bg-fun-yellow rounded-full animate-sparkle opacity-30"></div>
        <div className="absolute bottom-2 left-1/3 w-4 h-4 bg-fun-pink rounded-full animate-pulse-glow opacity-25"></div>
      </div>
      
      <div className="container relative px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-6 h-6 text-blackfriday-accent animate-pulse" />
              <span className="font-bold text-lg">BLACK FRIDAY</span>
              <Badge variant="secondary" className="bg-blackfriday-accent text-white animate-wiggle">
                <Gift className="w-3 h-3 mr-1" />
                -70%
              </Badge>
            </div>
            
            <div className="hidden md:flex items-center space-x-4 text-sm">
              <span>Se termine dans:</span>
              <div className="flex space-x-2">
                <div className="bg-blackfriday-card px-2 py-1 rounded font-mono">
                  {timeLeft.days}j
                </div>
                <div className="bg-blackfriday-card px-2 py-1 rounded font-mono">
                  {timeLeft.hours}h
                </div>
                <div className="bg-blackfriday-card px-2 py-1 rounded font-mono">
                  {timeLeft.minutes}m
                </div>
                <div className="bg-blackfriday-card px-2 py-1 rounded font-mono">
                  {timeLeft.seconds}s
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="secondary" 
              size="sm"
              className="bg-blackfriday-accent text-white hover:bg-blackfriday-accent/90 animate-pulse-glow"
            >
              <Tag className="w-4 h-4 mr-1" />
              Voir les offres
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="text-blackfriday-text hover:bg-blackfriday-card"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};