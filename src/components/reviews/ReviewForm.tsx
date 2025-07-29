import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useReviewStore } from '@/stores/reviewStore';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ReviewFormProps {
  productId: string;
}

export const ReviewForm = ({ productId }: ReviewFormProps) => {
  const { addReview } = useReviewStore();
  const { user } = useAuthStore();
  const [hoverRating, setHoverRating] = useState(0);
  const { t } = useTranslation();

  const reviewSchema = z.object({
    rating: z.number().min(1, t('rating_required')).max(5),
    comment: z.string().min(10, t('comment_min_length')),
  });

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof reviewSchema>) => {
    if (!user) {
      toast({ title: 'Erreur', description: 'Vous devez être connecté pour laisser un avis.', variant: 'destructive' });
      return;
    }

    await addReview({ ...values, productId, userId: user.id });
    toast({ title: 'Avis soumis', description: 'Merci pour votre avis !' });
    form.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Laisser un avis</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => {
                        const ratingValue = i + 1;
                        return (
                          <Star
                            key={ratingValue}
                            className={`w-6 h-6 cursor-pointer ${
                              ratingValue <= (hoverRating || field.value)
                                ? 'fill-primary text-primary'
                                : 'text-muted-foreground'
                            }`}
                            onClick={() => field.onChange(ratingValue)}
                            onMouseEnter={() => setHoverRating(ratingValue)}
                            onMouseLeave={() => setHoverRating(0)}
                          />
                        );
                      })}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('comment')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('comment_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={!user}>
              {user ? t('submit_review') : t('login_to_review')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};