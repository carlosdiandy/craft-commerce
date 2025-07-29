import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  count?: number;
  className?: string;
}

export const Rating = ({ value, count, className }: RatingProps) => {
  const fullStars = Math.floor(value);
  const hasHalfStar = value - fullStars >= 0.5;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[...Array(5)].map((_, i) => {
        if (i < fullStars) {
          return <Star key={i} className="w-4 h-4 fill-primary text-primary" />;
        }
        if (i === fullStars && hasHalfStar) {
          return <Star key={i} className="w-4 h-4 fill-primary text-primary" />;
        }
        return <Star key={i} className="w-4 h-4 text-muted-foreground" />;
      })}
      {count !== undefined && (
        <span className="text-xs text-muted-foreground ml-1">({count})</span>
      )}
    </div>
  );
};
