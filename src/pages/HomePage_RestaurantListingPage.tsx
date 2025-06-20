import React, { useState, useEffect } from 'react';
import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import RestaurantCard from '@/components/RestaurantCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, SlidersHorizontal, Star, Clock, Tag, UtensilsCrossed } from 'lucide-react';

// Sample Data
const DUMMY_PROMOTIONS = [
  { id: 'promo1', title: '50% Off Your First Order!', description: 'Valid for new users only. Terms apply.', imageUrl: 'https://source.unsplash.com/random/800x400/?food,promotion,discount&sig=1' },
  { id: 'promo2', title: 'Free Delivery Weekend', description: 'On all orders above $20 this weekend.', imageUrl: 'https://source.unsplash.com/random/800x400/?food,delivery,special&sig=2' },
  { id: 'promo3', title: 'New Italian Place!', description: 'Try authentic Pizza & Pasta today.', imageUrl: 'https://source.unsplash.com/random/800x400/?food,italian,pizza&sig=3' },
];

const DUMMY_RESTAURANTS = [
  { id: '1', name: 'The Gourmet Kitchen', imageUrl: 'https://source.unsplash.com/random/400x225/?food,gourmet&sig=11', cuisineTypes: ['Italian', 'Pizzeria', 'Cafe'], rating: 4.7, deliveryTime: '25-35 min', deliveryFee: 2.99 },
  { id: '2', name: 'Sushi Central', imageUrl: 'https://source.unsplash.com/random/400x225/?food,sushi&sig=12', cuisineTypes: ['Japanese', 'Sushi'], rating: 4.9, deliveryTime: '30-40 min', deliveryFee: 0 },
  { id: '3', name: 'Burger Hub', imageUrl: 'https://source.unsplash.com/random/400x225/?food,burger&sig=13', cuisineTypes: ['American', 'Burgers', 'Fast Food'], rating: 4.3, deliveryTime: '20-30 min', deliveryFee: 1.50 },
  { id: '4', name: 'Spice Route', imageUrl: 'https://source.unsplash.com/random/400x225/?food,indian&sig=14', cuisineTypes: ['Indian', 'Curry', 'Vegetarian'], rating: 4.6, deliveryTime: '35-45 min', deliveryFee: 2.00 },
  { id: '5', name: 'Green Leaf Cafe', imageUrl: 'https://source.unsplash.com/random/400x225/?food,salad&sig=15', cuisineTypes: ['Healthy', 'Salads', 'Vegan'], rating: 4.8, deliveryTime: '15-25 min', deliveryFee: 0 },
  { id: '6', name: 'Taco Fiesta', imageUrl: 'https://source.unsplash.com/random/400x225/?food,tacos&sig=16', cuisineTypes: ['Mexican', 'Tacos', 'Burritos'], rating: 4.4, deliveryTime: '20-30 min', deliveryFee: 3.50 },
];

interface RestaurantData {
  id: string;
  name: string;
  imageUrl: string;
  cuisineTypes: string[];
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
}

const HomePage_RestaurantListingPage = () => {
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    console.log('HomePage_RestaurantListingPage loaded');
    // Simulate API call
    setIsLoading(true);
    const timer = setTimeout(() => {
      setRestaurants(DUMMY_RESTAURANTS);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.cuisineTypes.some(cuisine => cuisine.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeader />
      <main className="flex-1 overflow-y-auto pt-4 pb-20 md:pb-6"> {/* Adjusted padding for AppHeader and AppFooter */}
        <div className="container mx-auto px-4 space-y-8">
          
          {/* Welcome Text & Search Section */}
          <section className="space-y-4 text-center md:text-left">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">What would you like to eat?</h1>
                <p className="text-gray-600 text-md md:text-lg mt-1">Discover delicious meals from local restaurants.</p>
            </div>
            <div className="relative w-full max-w-2xl mx-auto">
              <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search restaurants, cuisines, or dishes..."
                className="w-full pl-10 pr-4 py-3 h-12 rounded-lg text-base border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search for food or restaurants"
              />
            </div>
          </section>

          {/* Filter Buttons Section */}
          <section className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <Button variant="outline" size="sm"><SlidersHorizontal className="mr-2 h-4 w-4" /> All Filters</Button>
            <Button variant="outline" size="sm"><Star className="mr-2 h-4 w-4" /> Rating 4.0+</Button>
            <Button variant="outline" size="sm"><Clock className="mr-2 h-4 w-4" /> Under 30 min</Button>
            <Button variant="outline" size="sm"><Tag className="mr-2 h-4 w-4" /> Offers</Button>
          </section>

          {/* Promotional Carousel Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 px-1">Today's Offers</h2>
            <Carousel
              opts={{ align: "start", loop: true }}
              className="w-full max-w-screen-lg mx-auto"
            >
              <CarouselContent>
                {DUMMY_PROMOTIONS.map((promo) => (
                  <CarouselItem key={promo.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="flex aspect-[16/9] items-center justify-center p-0 relative">
                          <img src={promo.imageUrl} alt={promo.title} className="object-cover w-full h-full" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4">
                            <h3 className="text-lg font-semibold text-white leading-tight">{promo.title}</h3>
                            <p className="text-xs text-white/90 mt-1 line-clamp-2">{promo.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
            </Carousel>
          </section>

          {/* Restaurant Listing Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 px-1">Popular Restaurants</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-[180px] w-full rounded-lg" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                ))
              ) : filteredRestaurants.length > 0 ? (
                filteredRestaurants.map((restaurant, index) => (
                  <RestaurantCard
                    key={restaurant.id}
                    id={restaurant.id}
                    name={restaurant.name}
                    imageUrl={`${restaurant.imageUrl}&sig=${100 + index}`} // Ensure unique image signatures
                    cuisineTypes={restaurant.cuisineTypes}
                    rating={restaurant.rating}
                    deliveryTime={restaurant.deliveryTime}
                    deliveryFee={restaurant.deliveryFee}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12 space-y-3">
                  <UtensilsCrossed className="mx-auto h-16 w-16 text-gray-400" />
                  <p className="text-xl font-medium text-gray-600">No Restaurants Found</p>
                  <p className="text-gray-500">
                    {searchTerm ? "Try a different search term or clear your filters." : "We couldn't find any restaurants matching your criteria."}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
      <AppFooter />
    </div>
  );
};

export default HomePage_RestaurantListingPage;