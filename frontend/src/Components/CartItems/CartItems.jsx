import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './CartItems.css';
import { ShopContext } from '../../Context/ShopContext';
import remove_icon from '../Assets/cart_cross_icon.png';

const CartItems = () => {
  const { allProducts, cartItems, removeFromCart, addToCart, finalizePurchase } = useContext(ShopContext);

  if (!allProducts || !Array.isArray(allProducts)) {
    return <p>Error loading products</p>;
  }

  const getCartItemSize = (itemId) => {
    const [productId, size] = itemId.split('-');
    const product = allProducts.find((prod) => prod.id === parseInt(productId, 10));
    return product ? size : 'N/A';
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const [productId] = itemId.split('-');
      const product = allProducts.find((prod) => prod.id === parseInt(productId, 10));
      if (product) {
        totalAmount += product.new_price * cartItems[itemId];
      }
    }
    return totalAmount;
  };

  const formatPrice = (price) => {
    return price.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  };

  const cartItemsCount = Object.values(cartItems).reduce((acc, count) => acc + count, 0);

  const handleRemoveItemClick = (productId, size) => {
    // Remove todos os itens do produto do carrinho
    const itemsToRemove = cartItems[`${productId}-${size}`];
    for (let i = 0; i < itemsToRemove; i++) {
      removeFromCart(productId, size);
    }
  };

  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Size</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

      {cartItemsCount === 0 ? (
        <div>
          <p className="message-cart">Your Shopping Cart is Empty!</p>
          <hr />
        </div>
      ) : (
        Object.entries(cartItems).map(([itemId, quantity]) => {
          const [productId] = itemId.split('-');
          const product = allProducts.find((prod) => prod.id === parseInt(productId, 10));
          if (!product) return null;

          const total = product.new_price * quantity;

          return (
            <div key={itemId}>
              <div className="cartitems-format cartitems-format-main">
                {product.images && product.images.length > 0 && (
                  <Link to={`/product/${productId}`}>
                    <img src={product.images[0]} alt="" className='carticon-product-icon' />
                  </Link>
                )}
                <Link to={`/product/${productId}`}>{product.name}</Link>
                <p>{getCartItemSize(itemId)}</p>
                <p>${formatPrice(product.new_price)}</p>
                <div className='cartitems-quantity'>
                  <button onClick={() => removeFromCart(productId, getCartItemSize(itemId))}> - </button>
                  <span>{quantity}</span>
                  <button onClick={() => addToCart(productId, getCartItemSize(itemId))}> + </button>
                </div>
                <div className="cartitem-price-remove">
                  <p>${formatPrice(total)}</p>
                  <img
                    className='cartitems-remove-icon'
                    src={remove_icon}
                    onClick={() => handleRemoveItemClick(productId, getCartItemSize(itemId))}
                    alt=""
                  />
                </div>
              </div>
              <hr />
            </div>
          );
        })
      )}

      {cartItemsCount > 0 && (
        <div>
          <p>Total: ${formatPrice(getTotalCartAmount())}</p>
          <button onClick={finalizePurchase} className="finalize-button">
            Finalize Purchase
          </button>
        </div>
      )}
    </div>
  );
}

export default CartItems;
