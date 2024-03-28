import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [allProducts, setAllProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const isMounted = useRef(true);

  const saveCartToLocalStorage = useCallback((cart) => {
    localStorage.setItem('cartItems', JSON.stringify(cart));
  }, []);

  // Carregar os itens do carrinho do localStorage ao inicializar o contexto
  useEffect(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
  }, []);

  // Atualizar o localStorage sempre que houver alterações nos itens do carrinho
  useEffect(() => {
    saveCartToLocalStorage(cartItems);
  }, [cartItems, saveCartToLocalStorage]);

  const updateCartOnServer = async (url, requestBody) => {
    const authToken = localStorage.getItem('auth-token');
    if (authToken) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'auth-token': authToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`Error updating cart. Status: ${response.status}`);
        }

        try {
          const responseData = await response.text();
          console.log('Server Response:', responseData);

          if (response.headers.get('content-type')?.includes('application/json')) {
            const data = JSON.parse(responseData);

            if (typeof data === 'string' && data.toLowerCase().includes('added')) {
              console.log('Item added successfully.');
            } else {
              console.error('Unexpected server response:', data);
            }
          } else {
            console.log('Non-JSON server response:', responseData);
          }
        } catch (jsonError) {
          console.error('Error parsing JSON:', jsonError);
        }
      } catch (error) {
        console.error(`Error updating cart: ${error}`);
      }
    }
  };

  const addToCart = useCallback(async (itemId, size) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev, [`${itemId}-${size}`]: (prev[`${itemId}-${size}`] || 0) + 1 };
      return updatedCart;
    });

    await updateCartOnServer('http://localhost:4000/addtocart', { itemId, size });
  }, []);

  const removeFromCart = useCallback(async (itemId, size) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev, [`${itemId}-${size}`]: Math.max((prev[`${itemId}-${size}`] || 0) - 1, 0) };

      if (updatedCart[`${itemId}-${size}`] === 0) {
        // Remove completamente o item se a quantidade atingir zero
        const { [`${itemId}-${size}`]: removedItem, ...rest } = updatedCart;
        return rest;
      }

      return updatedCart;
    });

    await updateCartOnServer('http://localhost:4000/removefromcart', { itemId, size });
  }, []);

  const getTotalCartAmount = useCallback(() => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = allProducts.find((product) => product.id === Number(item));
        if (itemInfo) {
          totalAmount += cartItems[item] * itemInfo.new_price;
        }
      }
    }
    return totalAmount;
  }, [cartItems, allProducts]);

  const getTotalCartItems = useCallback(() => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  }, [cartItems]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:4000/allproducts');
      if (!response.ok) {
        throw new Error('Error fetching products. Status: ' + response.status);
      }
      const data = await response.json();
      if (isMounted.current) {
        setAllProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error.message);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;

    const initializeData = async () => {
      try {
        await fetchProducts();
      } catch (error) {
        console.error('Error initializing data:', error.message);
      }
    };

    initializeData();

    return () => {
      isMounted.current = false;
    };
  }, [fetchProducts]);

  const contextValue = {
    getTotalCartAmount,
    allProducts,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartItems,
    fetchProducts,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
