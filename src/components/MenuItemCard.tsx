import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Settings2, Plus, Minus } from 'lucide-react';
import { toast } from "sonner";

// Type definitions (can be moved to a shared types file in a larger project)
interface CustomizationChoice {
  id: string;
  label: string;
  priceModifier?: number;
}

export interface CustomizationOption {
  id: string;
  title: string;
  type: 'radio' | 'checkbox';
  choices: CustomizationChoice[];
  required?: boolean;
}

export interface SelectedCustomizationValue {
  title: string;
  selection: string; // Label of the selected choice(s)
  price: number;     // Total price impact of this selection
}

export interface CartItem {
  id: string;
  name: string;
  imageUrl: string;
  basePrice: number;
  unitPriceWithCustomizations: number; // Price for one unit with current customizations
  quantity: number;
  totalPrice: number; // unitPriceWithCustomizations * quantity
  customizations: SelectedCustomizationValue[];
}

export interface MenuItemCardProps {
  id: string;
  name: string;
  description: string;
  price: number; // Base price
  imageUrl: string;
  customizationOptions?: CustomizationOption[];
  onAddToCart: (item: CartItem) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  id,
  name,
  description,
  price,
  imageUrl,
  customizationOptions,
  onAddToCart,
}) => {
  console.log('MenuItemCard loaded for:', name);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  // Stores selected choice IDs: { optionId: choiceId } for radio, { optionId: choiceId[] } for checkbox
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string | string[]>>({});

  const hasCustomizations = customizationOptions && customizationOptions.length > 0;

  // Calculate current unit price based on selections
  const currentUnitPriceWithCustomizations = useMemo(() => {
    let currentPrice = price;
    if (hasCustomizations) {
      customizationOptions?.forEach(option => {
        const selection = selectedChoices[option.id];
        if (selection) {
          if (option.type === 'radio' && typeof selection === 'string') {
            const choice = option.choices.find(c => c.id === selection);
            if (choice?.priceModifier) currentPrice += choice.priceModifier;
          } else if (option.type === 'checkbox' && Array.isArray(selection)) {
            selection.forEach(selId => {
              const choice = option.choices.find(c => c.id === selId);
              if (choice?.priceModifier) currentPrice += choice.priceModifier;
            });
          }
        }
      });
    }
    return currentPrice;
  }, [price, selectedChoices, customizationOptions, hasCustomizations]);

  const totalPriceInDialog = currentUnitPriceWithCustomizations * quantity;

  useEffect(() => {
    // Reset dialog state when it's opened/closed or when relevant props change
    if (isDialogOpen) {
      setQuantity(1);
      const defaultSelections: Record<string, string | string[]> = {};
      customizationOptions?.forEach(option => {
        if (option.type === 'radio' && option.choices.length > 0 && option.required) {
           // Pre-select first option for required radio groups
          defaultSelections[option.id] = option.choices[0].id;
        } else if (option.type === 'checkbox') {
          defaultSelections[option.id] = [];
        }
      });
      setSelectedChoices(defaultSelections);
    }
  }, [isDialogOpen, customizationOptions]);


  const handleDirectAddToCart = () => {
    const cartItem: CartItem = {
      id,
      name,
      imageUrl,
      basePrice: price,
      unitPriceWithCustomizations: price, // No customizations
      quantity: 1, // Default to 1 for direct add
      totalPrice: price * 1,
      customizations: [],
    };
    onAddToCart(cartItem);
    toast.success(`${name} added to cart!`);
  };

  const handleDialogAddToCart = () => {
    const detailedCustomizations: SelectedCustomizationValue[] = [];
    customizationOptions?.forEach(option => {
      const selection = selectedChoices[option.id];
      if (selection) {
        let selectionLabel = '';
        let selectionPrice = 0;
        if (option.type === 'radio' && typeof selection === 'string') {
          const choice = option.choices.find(c => c.id === selection);
          if (choice) {
            selectionLabel = choice.label;
            if (choice.priceModifier) selectionPrice += choice.priceModifier;
          }
        } else if (option.type === 'checkbox' && Array.isArray(selection)) {
          const labels: string[] = [];
          selection.forEach(selId => {
            const choice = option.choices.find(c => c.id === selId);
            if (choice) {
              labels.push(choice.label);
              if (choice.priceModifier) selectionPrice += choice.priceModifier;
            }
          });
          selectionLabel = labels.join(', ');
        }
        if (selectionLabel) {
          detailedCustomizations.push({ title: option.title, selection: selectionLabel, price: selectionPrice });
        }
      }
    });

    const cartItem: CartItem = {
      id,
      name,
      imageUrl,
      basePrice: price,
      unitPriceWithCustomizations: currentUnitPriceWithCustomizations,
      quantity,
      totalPrice: totalPriceInDialog,
      customizations: detailedCustomizations,
    };
    onAddToCart(cartItem);
    toast.success(`${name} (customized) added to cart!`);
    setIsDialogOpen(false);
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  const handleRadioChange = (optionId: string, choiceId: string) => {
    setSelectedChoices(prev => ({ ...prev, [optionId]: choiceId }));
  };

  const handleCheckboxChange = (optionId: string, choiceId: string, checked: boolean) => {
    setSelectedChoices(prev => {
      const currentSelection = (prev[optionId] as string[]) || [];
      if (checked) {
        return { ...prev, [optionId]: [...currentSelection, choiceId] };
      } else {
        return { ...prev, [optionId]: currentSelection.filter(id => id !== choiceId) };
      }
    });
  };

  return (
    <Card className="w-full overflow-hidden flex flex-col">
      <div className="relative w-full aspect-[16/9]">
        <img
          src={imageUrl || 'https://via.placeholder.com/300x200'}
          alt={name}
          className="object-cover w-full h-full"
        />
      </div>
      <CardContent className="p-4 flex-grow space-y-2">
        <h3 className="text-lg font-semibold line-clamp-2">{name}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
        <p className="text-lg font-bold text-gray-800">${price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-3 border-t">
        {hasCustomizations ? (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Settings2 className="mr-2 h-4 w-4" /> Customize
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] md:max-w-[600px] max-h-[90vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>{name}</DialogTitle>
                <DialogDescription>
                  Customize your selection. Base price: ${price.toFixed(2)}
                </DialogDescription>
              </DialogHeader>
              <div className="flex-grow overflow-y-auto space-y-4 p-1">
                {customizationOptions?.map(option => (
                  <div key={option.id} className="space-y-2 border p-3 rounded-md">
                    <Label className="text-base font-medium">{option.title}{option.required && <span className="text-red-500">*</span>}</Label>
                    {option.type === 'radio' ? (
                      <RadioGroup
                        value={selectedChoices[option.id] as string || ''}
                        onValueChange={(value) => handleRadioChange(option.id, value)}
                      >
                        {option.choices.map(choice => (
                          <div key={choice.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={choice.id} id={`${option.id}-${choice.id}`} />
                            <Label htmlFor={`${option.id}-${choice.id}`} className="flex-grow">
                              {choice.label}
                              {choice.priceModifier ? ` ($${(choice.priceModifier > 0 ? '+' : '')}${choice.priceModifier.toFixed(2)})` : ''}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      option.choices.map(choice => (
                        <div key={choice.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${option.id}-${choice.id}`}
                            checked={(selectedChoices[option.id] as string[] || []).includes(choice.id)}
                            onCheckedChange={(checked) => handleCheckboxChange(option.id, choice.id, !!checked)}
                          />
                          <Label htmlFor={`${option.id}-${choice.id}`} className="flex-grow">
                            {choice.label}
                            {choice.priceModifier ? ` ($${(choice.priceModifier > 0 ? '+' : '')}${choice.priceModifier.toFixed(2)})` : ''}
                          </Label>
                        </div>
                      ))
                    )}
                  </div>
                ))}
                <div className="flex items-center space-x-2 pt-2">
                  <Label htmlFor="quantity" className="text-base font-medium">Quantity:</Label>
                  <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input id="quantity" type="number" value={quantity} readOnly className="w-16 text-center" />
                  <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xl font-semibold mt-4">
                  Total: ${totalPriceInDialog.toFixed(2)}
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleDialogAddToCart} className="w-full sm:w-auto">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : (
          <Button className="w-full" onClick={handleDirectAddToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MenuItemCard;