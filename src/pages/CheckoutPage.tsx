import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { CreditCard, Landmark, Package, ArrowRight } from 'lucide-react';

const checkoutFormSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required." }),
  addressLine1: z.string().min(1, { message: "Street address is required." }),
  addressLine2: z.string().optional(),
  city: z.string().min(1, { message: "City is required." }),
  state: z.string().min(1, { message: "State/Province is required." }),
  postalCode: z.string().min(5, { message: "Valid Postal/ZIP code is required." }),
  country: z.string().min(1, { message: "Country is required." }),
  phoneNumber: z.string().min(10, { message: "A valid phone number is required."}).regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  paymentMethod: z.enum(["creditCard", "paypal", "cod"], {
    required_error: "Please select a payment method.",
  }),
  promoCode: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

const CheckoutPage = () => {
  console.log('CheckoutPage loaded');
  const navigate = useNavigate();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "USA", // Default country
      phoneNumber: "",
      paymentMethod: undefined,
      promoCode: "",
    },
  });

  function onSubmit(data: CheckoutFormValues) {
    console.log("Checkout form submitted:", data);
    // Simulate API call
    toast.success("Order placed successfully!", {
      description: "You will be redirected to order tracking.",
    });
    // Navigate to order tracking/history page (ensure this route exists in App.tsx)
    navigate('/order-tracking_-history');
  }

  const handleApplyPromoCode = () => {
    const promoCode = form.getValues("promoCode");
    if (promoCode) {
      console.log("Applying promo code:", promoCode);
      toast.info(`Promo code "${promoCode}" applied (simulation).`);
      // Here you would typically validate the promo code and update the order summary
    } else {
      toast.warning("Please enter a promo code.");
    }
  };

  // Placeholder order summary values
  const orderSummary = {
    subtotal: 55.00,
    deliveryFee: 5.00,
    taxes: 4.50,
    promoDiscount: 0.00, // This could be updated if a promo code is applied
    get total() {
      return this.subtotal + this.deliveryFee + this.taxes - this.promoDiscount;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeader customTitle="Checkout" />
      <main className="flex-1 container mx-auto py-6 sm:py-8 px-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column: Delivery & Payment */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Address</CardTitle>
                  <CardDescription>Enter your shipping details.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="addressLine1"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="addressLine2"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Address Line 2 (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Apartment, suite, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Anytown" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State / Province</FormLabel>
                        <FormControl>
                          <Input placeholder="CA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal / ZIP Code</FormLabel>
                        <FormControl>
                          <Input placeholder="90210" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USA">United States</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-2">
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormDescription>For delivery updates.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Choose how you'd like to pay.</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-accent/50 has-[[data-state=checked]]:bg-accent has-[[data-state=checked]]:border-primary transition-colors">
                              <FormControl>
                                <RadioGroupItem value="creditCard" />
                              </FormControl>
                              <FormLabel className="font-normal flex-1 cursor-pointer flex items-center">
                                <CreditCard className="mr-2 h-5 w-5 text-blue-500" /> Credit / Debit Card
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-accent/50 has-[[data-state=checked]]:bg-accent has-[[data-state=checked]]:border-primary transition-colors">
                              <FormControl>
                                <RadioGroupItem value="paypal" />
                              </FormControl>
                              <FormLabel className="font-normal flex-1 cursor-pointer flex items-center">
                                <Landmark className="mr-2 h-5 w-5 text-purple-500" /> Online Payment (e.g., PayPal)
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-accent/50 has-[[data-state=checked]]:bg-accent has-[[data-state=checked]]:border-primary transition-colors">
                              <FormControl>
                                <RadioGroupItem value="cod" />
                              </FormControl>
                              <FormLabel className="font-normal flex-1 cursor-pointer flex items-center">
                                <Package className="mr-2 h-5 w-5 text-green-500" /> Cash on Delivery
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${orderSummary.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>${orderSummary.deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes (Est.)</span>
                    <span>${orderSummary.taxes.toFixed(2)}</span>
                  </div>
                  {orderSummary.promoDiscount > 0 && (
                     <div className="flex justify-between text-green-600">
                       <span>Promo Discount</span>
                       <span>-${orderSummary.promoDiscount.toFixed(2)}</span>
                     </div>
                  )}
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${orderSummary.total.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="w-full space-y-2">
                    <FormField
                        control={form.control}
                        name="promoCode"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Promo Code</FormLabel>
                            <div className="flex space-x-2">
                            <FormControl>
                                <Input placeholder="ENTERCODE" {...field} />
                            </FormControl>
                            <Button type="button" variant="outline" onClick={handleApplyPromoCode}>Apply</Button>
                            </div>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    Place Order <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    By placing your order, you agree to our Terms of Service.
                  </p>
                </CardFooter>
              </Card>
            </div>
          </form>
        </Form>
      </main>
      <AppFooter />
    </div>
  );
};

export default CheckoutPage;