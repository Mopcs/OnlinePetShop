import React from 'react';
import CartItem from './CartItem';

const CartList = ({ items, onUpdateQuantity, onRemove }) => {
  return (
    <div className="space-y-4">
      {items.map(item => (
        <CartItem
          key={item.productId}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default CartList;