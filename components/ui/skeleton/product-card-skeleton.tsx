import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Skeleton className="h-full w-full" />
      </div>
      <CardContent className="p-4">
        {/* Product title */}
        <Skeleton className="h-5 w-3/4 mb-2" />
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        
        {/* Add to Cart Button */}
        <div className="mt-auto">
          <Skeleton className="h-9 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
