import React from 'react';
import { Card } from './Card';
import { Button } from './Button';

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export interface CartItemType {
  id: string;
  product: Product;
  quantity: number;
  selectedForCheckout: boolean;
}

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  onSelect: (itemId: string, selected: boolean) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  onSelect,
}) => {
  const lineTotal = item.product.price * item.quantity;

  return (
    <Card className="mb-4">
      <div className="flex gap-4">
        {/* Product Image */}
        {item.product.image && (
          <img
            src={item.product.image}
            alt={item.product.name}
            className="w-20 h-20 object-cover rounded"
          />
        )}

        {/* Product Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
              <p className="text-sm text-gray-600">
                Giá: {item.product.price.toLocaleString()}đ
              </p>
            </div>
            <input
              type="checkbox"
              checked={item.selectedForCheckout}
              onChange={(e) => onSelect(item.id, e.target.checked)}
              className="w-5 h-5 cursor-pointer"
            />
          </div>

          {/* Quantity Control */}
          <div className="flex items-center gap-2 mt-3">
            <label className="text-sm text-gray-700">Số lượng:</label>
            <button
              onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
              className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            >
              −
            </button>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
              className="w-12 text-center border border-gray-300 rounded px-2 py-1"
            />
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            >
              +
            </button>
          </div>

          {/* Total and Delete */}
          <div className="flex items-center justify-between mt-3">
            <p className="font-semibold text-gray-900">
              Tổng: {lineTotal.toLocaleString()}đ
            </p>
            <Button
              onClick={() => onRemove(item.id)}
              variant="danger"
              size="small"
            >
              Xóa
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
