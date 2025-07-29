import { useReviewStore } from '@/stores/reviewStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface ReviewListProps {
  productId: string;
}

export const ReviewList = ({ productId }: ReviewListProps) => {
  const { getReviewsByProductId } = useReviewStore();
  const reviews = getReviewsByProductId(productId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('customer_reviews')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-muted-foreground">{t('no_reviews_yet')}</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="flex gap-4">
              <Avatar>
                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${review.userName}`} />
                <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{review.userName}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground mt-1">{review.comment}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
