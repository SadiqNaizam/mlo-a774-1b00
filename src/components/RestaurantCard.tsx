import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Star, Clock, Bike } from 'lucide-react';

interface RestaurantCardProps {
  id: string;
  name: string;
  imageUrl: string;
  cuisineTypes: string[];
  rating: number; // e.g., 4.5
  deliveryTime: string; // e.g., "20-30 min"
  deliveryFee: number; // e.g., 0 for free, or 2.99
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  imageUrl,
  cuisineTypes,
  rating,
  deliveryTime,
  deliveryFee,
}) => {
  console.log(`RestaurantCard loaded for: ${name} (ID: ${id})`);

  return (
    <Link 
      to={`/restaurant-menu?id=${id}`} 
      className="block rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
      aria-label={`View menu for ${name}`}
    >
      <Card className="w-full h-full flex flex-col border-0 group-hover:border-transparent"> {/* Remove card border if link wraps it for cleaner hover */}
        <CardHeader className="p-0">
          <AspectRatio ratio={16 / 9}>
            <img
              src={imageUrl || 'https://via.placeholder.com/400x225?text=Restaurant'}
              alt={`Image of ${name}`}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          </AspectRatio>
        </CardHeader>
        <CardContent className="p-4 space-y-2 flex-grow bg-white">
          <h3 className="text-xl font-semibold truncate group-hover:text-primary" title={name}>
            {name}
          </h3>
          
          {cuisineTypes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {cuisineTypes.slice(0, 3).map((cuisine, index) => (
                <Badge key={index} variant="secondary" className="text-xs font-normal">
                  {cuisine}
                </Badge>
              ))}
              {cuisineTypes.length > 3 && (
                <Badge variant="outline" className="text-xs font-normal">
                  +{cuisineTypes.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center text-sm text-muted-foreground space-x-3 pt-1">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
              <span className="font-medium text-gray-700">{rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{deliveryTime}</span>
            </div>
            <div className="flex items-center">
              <Bike className="w-4 h-4 mr-1" />
              <span>{deliveryFee === 0 ? 'Free delivery' : `$${deliveryFee.toFixed(2)}`}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default RestaurantCard;