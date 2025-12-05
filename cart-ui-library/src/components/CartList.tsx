import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { CartItem, CartItemType, Product } from './CartItem';

interface CartListProps {
  items: CartItemType[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  onSelect: (itemId: string, selected: boolean) => void;
  onCheckout: () => void;
  isLoading?: boolean;
}

export const CartList: React.FC<CartListProps> = ({
  items,
  onUpdateQuantity,
  onRemove,
  onSelect,
  onCheckout,
  isLoading = false,
}) => {
  const selectedItems = items.filter((item) => item.selectedForCheckout);
  const checkoutTotal = selectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <Card className="text-center py-8">
        <p className="text-gray-600 text-lg mb-4">Giỏ hàng của bạn trống</p>
        <p className="text-gray-500">Hãy thêm sản phẩm để bắt đầu mua sắm</p>
      </Card>
    );
  }

  return (
    <div>
      {/* Items List */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng ({totalItems} sản phẩm)</h2>
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
            onSelect={onSelect}
          />
        ))}
      </div>

      {/* Summary */}
      <Card className="bg-gray-50">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-700">Số sản phẩm chọn:</span>
            <span className="font-semibold">{selectedItems.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Số lượng chọn:</span>
            <span className="font-semibold">
              {selectedItems.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <div className="border-t border-gray-300 pt-3 flex justify-between text-lg">
            <span className="font-bold text-gray-900">Tổng thanh toán:</span>
            <span className="font-bold text-blue-600">
              {checkoutTotal.toLocaleString()}đ
            </span>
          </div>
        </div>

        {/* Checkout Button */}
        <Button
          onClick={onCheckout}
          disabled={selectedItems.length === 0 || isLoading}
          size="large"
          className="w-full mt-4"
        >
          {isLoading ? 'Đang xử lý...' : 'Thanh toán'}
        </Button>
      </Card>
    </div>
  );
};
