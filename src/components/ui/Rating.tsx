
import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  count?: number;
  className?: string;
}

export const Rating = ({ value = 0, count, className }: RatingProps) => {
  const safeValue = isNaN(value) || !isFinite(value) ? 0 : Math.max(0, Math.min(5, value));
  const fullStars = Math.floor(safeValue);
  const hasHalfStar = safeValue - fullStars >= 0.5;

  return (
    <div className={`flex items-center gap-1 ${className || ''}`}>
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return <Star key={i} className="w-4 h-4 fill-primary text-primary" />;
        }
        if (i === fullStars && hasHalfStar) {
          return (
            <Star 
              key={i} 
              className="w-4 h-4 text-primary relative"
              style={{
                background: `linear-gradient(90deg, hsl(var(--primary)) 50%, transparent 50%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fill: 'hsl(var(--primary))'
              }}
            />
          );
        }
        return <Star key={i} className="w-4 h-4 text-muted-foreground" />;
      })}
      {count !== undefined && count > 0 && (
        <span className="text-xs text-muted-foreground ml-1">({count})</span>
      )}
    </div>
  );
};
