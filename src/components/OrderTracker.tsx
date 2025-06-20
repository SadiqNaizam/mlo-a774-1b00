import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck, ChefHat, Bike, Truck, CheckCircle2 } from 'lucide-react';

const orderStages = [
  { name: 'Order Placed', icon: ClipboardCheck },
  { name: 'Restaurant Preparing', icon: ChefHat },
  { name: 'Rider Assigned', icon: Bike },
  { name: 'Out for Delivery', icon: Truck },
  { name: 'Delivered', icon: CheckCircle2 },
] as const; // 'as const' ensures type inference as a tuple of specific objects

// This creates a union type of all possible stage names:
// 'Order Placed' | 'Restaurant Preparing' | 'Rider Assigned' | 'Out for Delivery' | 'Delivered'
type OrderStatus = typeof orderStages[number]['name'];

interface OrderTrackerProps {
  orderId?: string;
  currentStatus: OrderStatus;
  estimatedDeliveryTime?: string;
}

const OrderTracker: React.FC<OrderTrackerProps> = ({ orderId, currentStatus, estimatedDeliveryTime }) => {
  console.log('OrderTracker loaded. Order ID:', orderId, 'Current Status:', currentStatus);

  const currentStageIndex = orderStages.findIndex(s => s.name === currentStatus);

  // Log a warning in development if an invalid status is provided
  if (currentStageIndex === -1 && process.env.NODE_ENV === 'development') {
    console.warn(`OrderTracker: Invalid currentStatus "${currentStatus}" received. Expected one of: ${orderStages.map(s => s.name).join(', ')}.`);
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl flex justify-between items-center">
          <span>Order Progress</span>
          {orderId && <span className="text-sm sm:text-base font-normal text-muted-foreground">#{orderId}</span>}
        </CardTitle>
        {estimatedDeliveryTime && (
          <CardDescription className="text-xs sm:text-sm pt-1">
            Estimated Delivery: {estimatedDeliveryTime}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-2 pb-6 px-2 sm:px-4 md:px-6"> {/* Responsive padding */}
        <div className="flex w-full items-start">
          {orderStages.map((stage, index) => {
            const isCompleted = index < currentStageIndex;
            const isActive = index === currentStageIndex && currentStageIndex !== -1; // Only active if status is valid

            // Determine styles based on step state
            let iconContainerClasses = 'bg-gray-100 border-gray-300 text-gray-400';
            let textClasses = 'text-gray-500';
            let ringClasses = '';

            if (isActive) {
              iconContainerClasses = 'bg-green-500 border-green-500 text-white';
              ringClasses = 'ring-2 ring-green-500 ring-offset-2';
              textClasses = 'text-green-600 font-bold';
            } else if (isCompleted) {
              iconContainerClasses = 'bg-green-500 border-green-500 text-white';
              textClasses = 'text-green-600 font-medium';
            }
            
            return (
              <React.Fragment key={stage.name}>
                {/* Step Item: flex-shrink-0 to prevent squishing, w-16/md:w-20 for consistent sizing */}
                <div className="flex flex-col items-center text-center flex-shrink-0 w-16 md:w-20">
                  <div
                    className={`
                      w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center relative
                      border-2 ${iconContainerClasses} ${ringClasses}
                      transition-all duration-300 ease-in-out
                    `}
                  >
                    <stage.icon className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
                  </div>
                  <p
                    className={`
                      mt-2 text-xs leading-tight md:text-sm ${textClasses}
                      transition-colors duration-300 ease-in-out
                    `}
                  >
                    {stage.name}
                  </p>
                </div>

                {/* Connector Line (not rendered after the last item) */}
                {index < orderStages.length - 1 && (
                  <div
                    className={`
                      flex-grow h-1.5 rounded
                      ${index < currentStageIndex ? 'bg-green-500' : 'bg-gray-300'}
                      mt-[17px] md:mt-[21px] /* Align with icon centers: icon height is 10 or 12 (2.5rem or 3rem), line height is 1.5 (0.375rem). Top = (IconH/2) - (LineH/2) */
                      mx-1 sm:mx-1.5 md:mx-2 /* Responsive margin */
                      transition-colors duration-300 ease-in-out delay-150
                    `}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTracker;