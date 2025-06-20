import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

// Custom Components
import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import MenuItemCard, { MenuItemCardProps as ImportedMenuItemCardProps, CustomizationOption, CartItem } from '@/components/MenuItemCard';

// Shadcn/ui Components
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, Clock, Bike, Utensils } from 'lucide-react'; // Icons

// Type for menu items within the page, omitting onAddToCart as it's added during render
type PageMenuItem = Omit<ImportedMenuItemCardProps, 'onAddToCart'>;

// Placeholder data structure for a restaurant
interface RestaurantData {
  id: string;
  name: string;
  coverImageUrl: string;
  logoUrl?: string;
  rating: number;
  ratingCount: number;
  deliveryTime: string;
  deliveryFee: number;
  description: string;
  address: string; // Example, not displayed prominently in this design
  menu: {
    category: string;
    items: PageMenuItem[];
  }[];
}

// Sample customization options (can be reused or varied)
const sampleCustomizations: CustomizationOption[] = [
  { 
    id: 'size', title: 'Choose Size', type: 'radio', required: true, 
    choices: [
      { id: 's1', label: 'Small' }, 
      { id: 's2', label: 'Medium', priceModifier: 2.00 },
      { id: 's3', label: 'Large', priceModifier: 4.00 }
    ]
  },
  {
    id: 'addons', title: 'Add Ons', type: 'checkbox',
    choices: [
      { id: 'a1', label: 'Extra Cheese', priceModifier: 1.50 },
      { id: 'a2', label: 'Spicy Sauce', priceModifier: 0.75 }
    ]
  }
];

const RestaurantMenuPage = () => {
  console.log('RestaurantMenuPage loaded');
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get('id');

  const [restaurantData, setRestaurantData] = useState<RestaurantData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cart, setCart] = useState<CartItem[]>([]); // Simple cart state for demonstration

  useEffect(() => {
    setIsLoading(true);
    console.log('Simulating fetch for restaurant ID:', restaurantId || 'default');
    // Simulate fetching restaurant data
    setTimeout(() => {
      const fetchedData: RestaurantData = {
        id: restaurantId || '1',
        name: restaurantId ? `The Gourmet Place (ID: ${restaurantId})` : 'The Gourmet Place',
        coverImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=1200&q=80',
        logoUrl: 'https://via.placeholder.com/128/FFD700/000000?Text=GP', // Gold placeholder logo
        rating: 4.7,
        ratingCount: 320,
        deliveryTime: '30-40 min',
        deliveryFee: 1.99,
        description: 'Experience exquisite flavors from around the world, prepared with the freshest ingredients by our renowned chefs.',
        address: '456 Culinary Avenue, Food Haven',
        menu: [
          {
            category: 'Starters',
            items: [
              { id: 'item1', name: 'Crispy Calamari', description: 'Lightly battered and fried calamari served with a zesty marinara sauce.', price: 12.99, imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FsYW1hcmklMjBmb29kfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', customizationOptions: [sampleCustomizations[1]] },
              { id: 'item2', name: 'Caprese Salad', description: 'Fresh mozzarella, ripe tomatoes, and basil, drizzled with balsamic glaze.', price: 10.50, imageUrl: 'https://images.unsplash.com/photo-1579112933102-1DS3661f1903?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FwcmVzZSUyMHNhbGFkfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60' },
            ],
          },
          {
            category: 'Main Courses',
            items: [
              { id: 'item3', name: 'Ribeye Steak', description: '12oz prime ribeye, grilled to perfection, served with garlic mashed potatoes and seasonal vegetables.', price: 28.99, imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RlYWt8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', customizationOptions: sampleCustomizations },
              { id: 'item4', name: 'Seafood Paella', description: 'Traditional Spanish rice dish with shrimp, mussels, clams, and chorizo.', price: 24.50, imageUrl: 'https://images.unsplash.com/photo-1590973680439-9355d86f99f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2VhZm9vZCUyMHBhZWxsYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60' },
              { id: 'item5', name: 'Vegan Burger Deluxe', description: 'Plant-based patty with all the fixings on a whole wheat bun, served with sweet potato fries.', price: 16.75, imageUrl: 'https://images.unsplash.com/photo-1572448862527-d3c904757de6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dmVnYW4lMjBidXJnZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60', customizationOptions: [{...sampleCustomizations[1], choices: sampleCustomizations[1].choices.slice(0,1)}]},
            ],
          },
          {
            category: 'Desserts',
            items: [
              { id: 'item6', name: 'New York Cheesecake', description: 'Classic creamy cheesecake with a graham cracker crust and berry compote.', price: 9.00, imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGVzc2VydHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60' },
            ],
          },
          {
            category: 'Beverages',
            items: [
              { id: 'item7', name: 'Artisanal Lemonade', description: 'Freshly squeezed lemonade with a hint of mint.', price: 4.50, imageUrl: 'https://images.unsplash.com/photo-1542276050-b7590836444a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGVtb25hZGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' },
              { id: 'item8', name: 'Sparkling Water', description: 'Imported sparkling mineral water.', price: 3.00, imageUrl: 'https://images.unsplash.com/photo-1607880445674-ac990b8995f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3BhcmtsaW5nJTIwd2F0ZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' },
            ]
          }
        ],
      };
      setRestaurantData(fetchedData);
      setIsLoading(false);
    }, 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantId]);

  const handleAddToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        cartItem => cartItem.id === item.id && JSON.stringify(cartItem.customizations) === JSON.stringify(item.customizations)
      );
      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += item.quantity;
        updatedCart[existingItemIndex].totalPrice += item.totalPrice; // Assuming MenuItemCard calculates this correctly based on its quantity
        return updatedCart;
      } else {
        return [...prevCart, item];
      }
    });
    // MenuItemCard handles its own toast notification upon adding item.
    console.log("Item added to cart by RestaurantMenuPage:", item);
  };

  if (isLoading) {
    return (
      <>
        <AppHeader customTitle="Loading Restaurant..." />
        <div className="container mx-auto px-4 py-6 pb-20 md:pb-8"> {/* Padding bottom for AppFooter */}
          <Card className="mb-8 shadow-lg">
            <Skeleton className="h-48 w-full md:h-64" />
            <CardContent className="p-6 pt-16 md:pt-20 relative">
              <Skeleton className="absolute left-6 -top-12 md:-top-16 h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-background" />
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-3" />
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-28" />
              </div>
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>

          <div className="mb-6">
            <div className="flex space-x-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i}>
                <Skeleton className="aspect-[16/9] w-full" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
                <CardFooter className="p-3 border-t">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        <AppFooter />
      </>
    );
  }

  if (!restaurantData) {
    return (
      <>
        <AppHeader customTitle="Restaurant Not Found" />
        <main className="container mx-auto px-4 py-8 text-center flex-grow flex flex-col justify-center items-center pb-20 md:pb-8">
          <Utensils className="w-16 h-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Oops! Restaurant not found.</h1>
          <p className="text-muted-foreground mb-6">We couldn't find the details for this restaurant. It might be unavailable or the link may be incorrect.</p>
          <Link to="/">
            <Button>Go Back to Home</Button>
          </Link>
        </main>
        <AppFooter />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader customTitle={restaurantData.name} />
      <main className="flex-grow container mx-auto px-2 sm:px-4 py-6 pb-20 md:pb-8">
        <Card className="mb-8 shadow-lg overflow-hidden">
          <div className="relative">
            <img 
              src={restaurantData.coverImageUrl} 
              alt={`${restaurantData.name} cover image`}
              className="w-full h-48 md:h-64 object-cover" 
            />
            {restaurantData.logoUrl && (
              <div className="absolute bottom-0 left-4 sm:left-6 transform translate-y-1/2">
                 <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-md bg-muted">
                    <AvatarImage src={restaurantData.logoUrl} alt={`${restaurantData.name} logo`} />
                    <AvatarFallback className="text-3xl md:text-4xl">
                        {restaurantData.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
          <CardContent className={`p-4 sm:p-6 ${restaurantData.logoUrl ? 'pt-16 md:pt-20' : 'pt-6'}`}>
            <CardTitle className="text-2xl md:text-3xl font-bold mb-1 sm:mb-2">{restaurantData.name}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mb-2 sm:mb-3">{restaurantData.description}</CardDescription>
            <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 sm:gap-y-2 text-sm text-muted-foreground mb-2 sm:mb-3">
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" /> 
                <span className="font-medium">{restaurantData.rating.toFixed(1)}</span>
                <span className="ml-1">({restaurantData.ratingCount}+ ratings)</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" /> 
                <span>{restaurantData.deliveryTime}</span>
              </div>
              <div className="flex items-center">
                <Bike className="w-4 h-4 mr-1" /> 
                <span>{restaurantData.deliveryFee === 0 ? 'Free delivery' : `$${restaurantData.deliveryFee.toFixed(2)}`}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
                <Utensils className="w-3 h-3 mr-1.5 inline-block relative -top-px" /> 
                Cuisines: {restaurantData.menu.map(cat => cat.category).slice(0,3).join(', ')}{restaurantData.menu.length > 3 ? ' and more' : ''}
            </p>
          </CardContent>
        </Card>

        {restaurantData.menu.length > 0 ? (
            <Tabs defaultValue={restaurantData.menu[0].category} className="w-full">
            <TabsList className="mb-6 sticky top-16 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 -mx-2 sm:-mx-0 px-2 sm:px-0 overflow-x-auto whitespace-nowrap pb-1 flex-nowrap justify-start sm:flex-wrap sm:h-auto">
                {restaurantData.menu.map((categoryObj) => (
                <TabsTrigger key={categoryObj.category} value={categoryObj.category} className="capitalize text-sm sm:text-base shrink-0">
                    {categoryObj.category}
                </TabsTrigger>
                ))}
            </TabsList>

            {restaurantData.menu.map((categoryObj) => (
                <TabsContent key={categoryObj.category} value={categoryObj.category}>
                <section aria-labelledby={`${categoryObj.category}-heading`}>
                    <h2 id={`${categoryObj.category}-heading`} className="text-xl sm:text-2xl font-semibold mb-4 capitalize">
                    {categoryObj.category}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {categoryObj.items.map((item) => (
                        <MenuItemCard
                        key={item.id}
                        {...item}
                        onAddToCart={handleAddToCart}
                        />
                    ))}
                    </div>
                </section>
                </TabsContent>
            ))}
            </Tabs>
        ) : (
            <Card className="text-center py-12">
                <CardContent>
                    <Utensils className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Menu Coming Soon!</h3>
                    <p className="text-muted-foreground">This restaurant is currently updating its menu. Please check back later.</p>
                </CardContent>
            </Card>
        )}
      </main>
      <AppFooter />
    </div>
  );
};

export default RestaurantMenuPage;