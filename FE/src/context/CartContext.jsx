/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const getProductKey = (product) => product._id || product.id;

export const useCart = () => useContext(CartContext);

const getUserFromStorage = () => {
  return JSON.parse(localStorage.getItem('anhy_user') || localStorage.getItem('anhy_admin') || 'null');
};

export const CartProvider = ({ children }) => {
  const [user, setUser] = useState(getUserFromStorage());
  
  const cartKey = user ? `cart_${user._id}` : 'cart_guest';
  const wishlistKey = user ? `wishlist_${user._id}` : 'wishlist_guest';

  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem(cartKey);
    return localData ? JSON.parse(localData) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState(() => {
    const localData = localStorage.getItem(wishlistKey);
    return localData ? JSON.parse(localData) : [];
  });

  // Listen for user login/logout (storage event)
  useEffect(() => {
    const syncUser = () => {
      const newUser = getUserFromStorage();
      
      // If we just logged in (transition from guest to user)
      if (!user && newUser) {
        const guestCart = JSON.parse(localStorage.getItem('cart_guest') || '[]');
        const userCart = JSON.parse(localStorage.getItem(`cart_${newUser._id}`) || '[]');
        
        // Merge guest items into user cart
        const mergedCart = [...userCart];
        guestCart.forEach(gItem => {
          const existIndex = mergedCart.findIndex(uItem => getProductKey(uItem) === getProductKey(gItem));
          if (existIndex > -1) {
            mergedCart[existIndex].qty += gItem.qty;
          } else {
            mergedCart.push(gItem);
          }
        });

        // Update state and storage
        setCartItems(mergedCart);
        localStorage.setItem(`cart_${newUser._id}`, JSON.stringify(mergedCart));
        localStorage.removeItem('cart_guest');

        // Same for wishlist
        const guestWish = JSON.parse(localStorage.getItem('wishlist_guest') || '[]');
        const userWish = JSON.parse(localStorage.getItem(`wishlist_${newUser._id}`) || '[]');
        const mergedWish = [...userWish];
        guestWish.forEach(gItem => {
          if (!mergedWish.some(uItem => getProductKey(uItem) === getProductKey(gItem))) {
            mergedWish.push(gItem);
          }
        });
        setWishlist(mergedWish);
        localStorage.setItem(`wishlist_${newUser._id}`, JSON.stringify(mergedWish));
        localStorage.removeItem('wishlist_guest');

      } else if (user && !newUser) {
        // Just logged out, clear current view and load guest cart (usually empty)
        setCartItems([]);
        setWishlist([]);
      } else {
        // Normal switch or initialization
        const key = newUser ? `cart_${newUser._id}` : 'cart_guest';
        const wKey = newUser ? `wishlist_${newUser._id}` : 'wishlist_guest';
        setCartItems(JSON.parse(localStorage.getItem(key) || '[]'));
        setWishlist(JSON.parse(localStorage.getItem(wKey) || '[]'));
      }
      
      setUser(newUser);
    };

    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, [user]);

  // Sync state to current storage key whenever they change
  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, cartKey]);

  useEffect(() => {
    localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
  }, [wishlist, wishlistKey]);

  const addToCart = (product) => {
    const productKey = getProductKey(product);
    setCartItems((prevItems) => {
      const exist = prevItems.find((item) => getProductKey(item) === productKey);
      if (exist) {
        return prevItems.map((item) =>
          getProductKey(item) === productKey ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, qty: 1 }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => getProductKey(item) !== productId));
  };

  const updateQty = (productId, qty) => {
    if (qty < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) => (getProductKey(item) === productId ? { ...item, qty } : item))
    );
  };

  const toggleWishlist = (product) => {
    const productKey = getProductKey(product);
    setWishlist((items) => {
      const exists = items.some((item) => getProductKey(item) === productKey);
      return exists ? items.filter((item) => getProductKey(item) !== productKey) : [...items, product];
    });
  };

  const isWishlisted = (product) => {
    const productKey = getProductKey(product);
    return wishlist.some((item) => getProductKey(item) === productKey);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        isCartOpen,
        setIsCartOpen,
        cartCount,
        cartTotal,
        getProductKey,
        wishlist,
        toggleWishlist,
        isWishlisted,
        user, // Added user to context just in case
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
