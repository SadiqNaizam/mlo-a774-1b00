import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Using Input for quantity display, can be made editable or just styled text
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItemRowProps {
  id: string | number;
  thumbnailUrl: string;
  name: string;
  customizations?: string[]; // e.g., ["Extra cheese", "No onions"]
  quantity: number;
  pricePerItem: number; // Price of a single unit
  onQuantityChange: (itemId: string | number, newQuantity: number) => void;
  onRemoveItem: (itemId: string | number) => void;
  // Potentially add stock limits if needed in future
  // maxQuantity?: number; 
}

const CartItemRow: React.FC<CartItemRowProps> = ({
  id,
  thumbnailUrl,
  name,
  customizations = [],
  quantity,
  pricePerItem,
  onQuantityChange,
  onRemoveItem,
}) => {
  console.log(`CartItemRow loaded for item ID: ${id}, Name: ${name}`);

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      onQuantityChange(id, quantity - 1);
    }
    // Optional: if quantity becomes 1 and user clicks minus, it could trigger remove.
    // else if (quantity === 1) {
    //   onRemoveItem(id);
    // }
  };

  const handleIncreaseQuantity = () => {
    // Add check for maxQuantity if prop is introduced
    onQuantityChange(id, quantity + 1);
  };

  const handleRemove = () => {
    onRemoveItem(id);
  };

  const itemSubtotal = (quantity * pricePerItem).toFixed(2);

  return (
    <div className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {/* Thumbnail */}
      <div className="w-20 h-20 mr-4 flex-shrink-0">
        <img 
          src={thumbnailUrl || 'https://via.placeholder.com/80'} 
          alt={name} 
          className="w-full h-full object-cover rounded-md" 
        />
      </div>

      {/* Item Details & Customizations */}
      <div className="flex-grow mr-4">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        {customizations.length > 0 && (
          <ul className="text-xs text-gray-500 list-disc list-inside mt-1">
            {customizations.map((cust, index) => (
              <li key={index}>{cust}</li>
            ))}
          </ul>
        )}
        <p className="text-sm text-gray-600 mt-1">Price: ${pricePerItem.toFixed(2)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2 mr-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleDecreaseQuantity}
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input 
          type="number" 
          className="w-16 text-center" 
          value={quantity} 
          readOnly // Or allow direct input and handle with onQuantityChange
          aria-label="Current quantity"
        />
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleIncreaseQuantity}
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Item Subtotal */}
      <div className="w-24 text-right mr-4">
        <p className="text-md font-semibold text-gray-800">${itemSubtotal}</p>
      </div>

      {/* Remove Button */}
      <div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          aria-label="Remove item"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default CartItemRow;