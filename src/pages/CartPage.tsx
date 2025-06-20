import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import CartItemRow from '@/components/CartItemRow';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from "sonner";
import { ShoppingBag, Tag } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  thumbnailUrl: string;
  customizations?: string[];
  quantity: number;
  pricePerItem: number;
}

const initialCartItems: CartItem[] = [
  {
    id: 'item1',
    name: 'Spicy Pepperoni Pizza',
    thumbnailUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
    customizations: ['Extra Cheese', 'Thin Crust'],
    quantity: 1,
    pricePerItem: 15.99,
  },
  {
    id: 'item2',
    name: 'Classic Beef Burger',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
    customizations: ['Add Bacon', 'No Pickles'],
    quantity: 2,
    pricePerItem: 9.50,
  },
  {
    id: 'item3',
    name: 'Caesar Salad',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
    quantity: 1,
    pricePerItem: 7.25,
  },
];

const DELIVERY_FEE = 5.00;
const TAX_RATE = 0.08; // 8%

const CartPage: React.FC = () => {
  console.log('CartPage loaded');
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoDiscount, setAppliedPromoDiscount] = useState(0);

  const [isRemoveAlertOpen, setIsRemoveAlertOpen] = useState(false);
  const [itemToRemoveId, setItemToRemoveId] = useState<string | null>(null);

  const handleQuantityChange = (itemId: string | number, newQuantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const openRemoveConfirmation = (itemId: string | number) => {
    setItemToRemoveId(itemId as string);
    setIsRemoveAlertOpen(true);
  };

  const handleRemoveItem = () => {
    if (itemToRemoveId) {
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemToRemoveId));
      toast.success("Item removed from cart.");
    }
    setIsRemoveAlertOpen(false);
    setItemToRemoveId(null);
  };

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.pricePerItem * item.quantity, 0);
  }, [cartItems]);

  const taxes = useMemo(() => {
    return (subtotal - appliedPromoDiscount) * TAX_RATE;
  }, [subtotal, appliedPromoDiscount, TAX_RATE]);

  const total = useMemo(() => {
    return subtotal - appliedPromoDiscount + DELIVERY_FEE + taxes;
  }, [subtotal, appliedPromoDiscount, DELIVERY_FEE, taxes]);

  const handleApplyPromoCode = () => {
    if (promoCode.toUpperCase() === 'SAVE10') {
      const discount = subtotal * 0.10; // 10% discount
      setAppliedPromoDiscount(discount);
      toast.success(`Promo code "SAVE10" applied! You saved $${discount.toFixed(2)}.`);
    } else if (promoCode.toUpperCase() === 'FREEDEL') {
        // This would ideally set delivery fee to 0, but for simplicity we'll give a fixed discount
        const discount = DELIVERY_FEE;
        setAppliedPromoDiscount(DELIVERY_FEE);
        toast.success(`Promo code "FREEDEL" applied! Free delivery discount of $${discount.toFixed(2)} applied.`);
    } else {
      setAppliedPromoDiscount(0);
      toast.error("Invalid promo code.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-grow container mx-auto py-8 px-4 mt-16 mb-16 md:mb-0 flex flex-col items-center justify-center text-center">
          <ShoppingBag className="w-24 h-24 text-muted-foreground mb-6" />
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Button size="lg" onClick={() => navigate('/')}>
            Start Shopping
          </Button>
        </main>
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeader />
      <main className="flex-grow container mx-auto py-8 px-4 mt-16 mb-20 md:mb-8"> {/* Added bottom padding for AppFooter */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">My Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items List */}
          <section className="lg:col-span-2 space-y-4 bg-white p-4 sm:p-6 rounded-lg shadow">
            {cartItems.map(item => (
              <React.Fragment key={item.id}>
                <CartItemRow
                  id={item.id}
                  name={item.name}
                  thumbnailUrl={item.thumbnailUrl}
                  customizations={item.customizations}
                  quantity={item.quantity}
                  pricePerItem={item.pricePerItem}
                  onQuantityChange={handleQuantityChange}
                  onRemoveItem={openRemoveConfirmation}
                />
                <Separator className="last:hidden" />
              </React.Fragment>
            ))}
          </section>

          {/* Order Summary */}
          <aside className="lg:col-span-1 sticky top-24"> {/* Sticky summary */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {appliedPromoDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Promo Discount</span>
                    <span>-${appliedPromoDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>${DELIVERY_FEE.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes ({(TAX_RATE * 100).toFixed(0)}%)</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="space-y-2 pt-2">
                  <Label htmlFor="promo" className="text-sm font-medium flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-muted-foreground"/>
                    Promo Code
                  </Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="promo"
                      placeholder="Enter promo code" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button onClick={handleApplyPromoCode} variant="outline" disabled={!promoCode}>Apply</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  size="lg" 
                  className="w-full" 
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </aside>
        </div>
      </main>
      <AppFooter />

      <AlertDialog open={isRemoveAlertOpen} onOpenChange={setIsRemoveAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Item?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this item from your cart?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToRemoveId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveItem} className="bg-red-600 hover:bg-red-700">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CartPage;

// Minimal Label component if not using shadcn/ui Label consistently or for specific use cases
// If shadcn/ui Label is used, it should be imported from '@/components/ui/label'
const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    {...props}
  />
));
Label.displayName = "Label";