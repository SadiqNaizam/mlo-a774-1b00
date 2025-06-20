import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import OrderTracker from '@/components/OrderTracker'; // Custom component

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Package, History, Star, ShoppingBag } from 'lucide-react';

// Define types for order data (OrderStatus matches the one implicitly defined in OrderTracker.tsx)
type OrderStatus = 'Order Placed' | 'Restaurant Preparing' | 'Rider Assigned' | 'Out for Delivery' | 'Delivered';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface ActiveOrderData {
  orderId: string;
  currentStatus: OrderStatus;
  estimatedDeliveryTime: string;
  restaurantName: string;
  items: OrderItem[];
  imageUrl: string;
}

interface PastOrderData {
  id: string;
  date: string;
  restaurantName: string;
  restaurantId: string; // For reorder link
  status: 'Delivered' | 'Cancelled';
  totalAmount: number;
  items: OrderItem[];
  imageUrl: string;
}

// Placeholder data
const sampleActiveOrder: ActiveOrderData | null = {
  orderId: "LIVE001",
  currentStatus: "Restaurant Preparing",
  estimatedDeliveryTime: "Approx. 25-35 mins",
  restaurantName: "Burger Palace",
  items: [
    { name: "Cheeseburger Deluxe", quantity: 1, price: 12.50 },
    { name: "Fries", quantity: 1, price: 3.00 },
    { name: "Milkshake", quantity: 1, price: 4.50 },
  ],
  imageUrl: "https://via.placeholder.com/150/FF9800/FFFFFF?Text=Burger"
};

// const sampleActiveOrder: ActiveOrderData | null = null; // To test empty state

const samplePastOrders: PastOrderData[] = [
  {
    id: "PAST001",
    date: "2024-07-20",
    restaurantName: "Sushi Express",
    restaurantId: "sushi-express-123", // Example ID
    status: "Delivered",
    totalAmount: 35.75,
    items: [
      { name: "Salmon Lover Set", quantity: 1, price: 25.00 },
      { name: "Edamame", quantity: 1, price: 5.75 },
      { name: "Green Tea", quantity: 2, price: 5.00 },
    ],
    imageUrl: "https://via.placeholder.com/150/4CAF50/FFFFFF?Text=Sushi"
  },
  {
    id: "PAST002",
    date: "2024-07-18",
    restaurantName: "Pizza Heaven",
    restaurantId: "pizza-heaven-456", // Example ID
    status: "Delivered",
    totalAmount: 28.50,
    items: [
      { name: "Large Pepperoni Pizza", quantity: 1, price: 20.00 },
      { name: "Garlic Knots", quantity: 1, price: 5.50 },
      { name: "Soda (2L)", quantity: 1, price: 3.00 },
    ],
    imageUrl: "https://via.placeholder.com/150/F44336/FFFFFF?Text=Pizza"
  },
  {
    id: "PAST003",
    date: "2024-07-15",
    restaurantName: "Curry House",
    restaurantId: "curry-house-789", // Example ID
    status: "Cancelled",
    totalAmount: 18.90,
    items: [
      { name: "Chicken Tikka Masala", quantity: 1, price: 14.90 },
      { name: "Naan Bread", quantity: 2, price: 4.00 },
    ],
    imageUrl: "https://via.placeholder.com/150/9C27B0/FFFFFF?Text=Curry"
  }
];
// const samplePastOrders: PastOrderData[] = []; // To test empty state

const OrderTracking_HistoryPage = () => {
  console.log('OrderTracking_HistoryPage loaded');
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeader customTitle="Order Status & History" />
      
      <main className="flex-1 container mx-auto py-6 px-4 mb-16 md:mb-0"> {/* mb-16 for footer space on mobile */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'active' | 'history')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 sticky top-16 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:top-0 md:relative"> {/* Adjust sticky top based on header height */}
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Package className="h-4 w-4" /> Active Orders
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" /> Order History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            {sampleActiveOrder ? (
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle className="text-xl md:text-2xl">Tracking: {sampleActiveOrder.restaurantName}</CardTitle>
                      <CardDescription>Order ID: #{sampleActiveOrder.orderId}</CardDescription>
                    </div>
                    <img 
                      src={sampleActiveOrder.imageUrl} 
                      alt={sampleActiveOrder.restaurantName} 
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover flex-shrink-0" 
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <OrderTracker
                    orderId={sampleActiveOrder.orderId}
                    currentStatus={sampleActiveOrder.currentStatus}
                    estimatedDeliveryTime={sampleActiveOrder.estimatedDeliveryTime}
                  />
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="font-semibold text-lg mb-2">Order Summary:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {sampleActiveOrder.items.map((item, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{item.name} (x{item.quantity})</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                     <p className="text-right font-semibold mt-2 text-base">
                        Total: ${sampleActiveOrder.items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="text-center py-12 shadow">
                <CardContent className="flex flex-col items-center">
                  <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-700">No Active Orders</h3>
                  <p className="text-gray-500 mt-2">Your currently processing orders will appear here.</p>
                  <Link to="/">
                    <Button className="mt-6" size="lg">
                      <ShoppingBag className="mr-2 h-5 w-5" /> Browse Restaurants
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-6 space-y-6">
            {samplePastOrders.length > 0 ? (
              samplePastOrders.map((order) => (
                <Card key={order.id} className="shadow-lg">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div>
                        <CardTitle className="text-lg md:text-xl">Order #{order.id} <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{order.status}</span></CardTitle>
                        <CardDescription className="mt-1">
                          {order.restaurantName} - Placed on: {new Date(order.date).toLocaleDateString()}
                        </CardDescription>
                      </div>
                       <img src={order.imageUrl} alt={order.restaurantName} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0 self-center sm:self-start" />
                    </div>
                    <p className="text-md sm:text-lg font-semibold mt-2">Total: ${order.totalAmount.toFixed(2)}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value={`order-${order.id}-details`}>
                        <AccordionTrigger className="text-sm">View Items ({order.items.length})</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {order.items.map((item, index) => (
                              <li key={index} className="flex justify-between">
                                <span>{item.name} (x{item.quantity})</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-2 pt-2 border-t">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Star className="mr-2 h-4 w-4" /> Leave Review
                    </Button>
                    {order.status === 'Delivered' && ( // Only allow reorder for delivered items, for example
                      <Link to={`/restaurant-menu?id=${order.restaurantId}`} className="w-full sm:w-auto">
                        <Button className="w-full">
                          <ShoppingBag className="mr-2 h-4 w-4" /> Reorder
                        </Button>
                      </Link>
                    )}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card className="text-center py-12 shadow">
                <CardContent className="flex flex-col items-center">
                  <History className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-700">No Order History</h3>
                  <p className="text-gray-500 mt-2">Your completed or cancelled orders will appear here.</p>
                  <Link to="/">
                    <Button className="mt-6" size="lg">
                      <ShoppingBag className="mr-2 h-5 w-5" /> Start Ordering
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <AppFooter />
    </div>
  );
};

export default OrderTracking_HistoryPage;