import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { AddToCartButton } from '@/components/ui/cart/add-to-cart-button';

interface ProductCardProps {
  product: any;
  onOpenModal?: (productId: string) => void;
}

export default function ProductCard({ product, onOpenModal }: ProductCardProps) {
  return (
    <div 
      onClick={() => onOpenModal ? onOpenModal(product._id) : null}
      className="block h-full cursor-pointer"
    >
      <Card className="h-full overflow-hidden hover:border-primary transition-colors group">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={(product.images && product.images.length > 0) ? product.images[0] : (product.image || '/placeholder.png')}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.discount > 0 && (
            <Badge className="absolute top-2 right-2 bg-destructive hover:bg-destructive">
              {product.discount}% OFF
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium line-clamp-1 mb-1">{product.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <div className="flex items-center">
              {Array(5)
                .fill(null)
                .map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.round(product.rating) ? 'fill-primary text-primary' : 'fill-muted text-muted'}
                  />
                ))}
            </div>
            <span>({product.reviews?.length || 0} reviews)</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                €{typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
              </span>
              {product.originalPrice && product.originalPrice !== product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  €{typeof product.originalPrice === 'number' ? product.originalPrice.toFixed(2) : '0.00'}
                </span>
              )}
            </div>
            {product.stock < 10 && product.stock > 0 && (
              <span className="text-xs text-amber-600">Only {product.stock} left</span>
            )}
            {product.stock === 0 && (
              <span className="text-xs text-destructive">Out of stock</span>
            )}
          </div>
          
          {/* Add to Cart Button */}
          <div className="mt-auto" onClick={(e) => e.stopPropagation()}>
            <AddToCartButton 
              product={product} 
              variant="secondary" 
              size="sm" 
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
