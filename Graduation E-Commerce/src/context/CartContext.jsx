import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    // Get current user email/ID for unique cart storage
    const getUserIdentifier = () => {
        const email = localStorage.getItem('email');
        const token = localStorage.getItem('auth_token');
        return email || (token ? 'guest_' + token.substring(0, 10) : 'guest');
    };

    // Load cart from localStorage on mount and when user changes
    useEffect(() => {
        const userIdentifier = getUserIdentifier();
        setCurrentUser(userIdentifier);
        
        const cartKey = `cart_${userIdentifier}`;
        const savedCart = localStorage.getItem(cartKey);
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        } else {
            setCartItems([]);
        }
    }, []);

    // Listen for auth changes (login/logout)
    useEffect(() => {
        const handleStorageChange = () => {
            const newUserIdentifier = getUserIdentifier();
            if (newUserIdentifier !== currentUser) {
                setCurrentUser(newUserIdentifier);
                const cartKey = `cart_${newUserIdentifier}`;
                const savedCart = localStorage.getItem(cartKey);
                if (savedCart) {
                    setCartItems(JSON.parse(savedCart));
                } else {
                    setCartItems([]);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        // Also listen for custom event when user logs in/out within same tab
        window.addEventListener('auth-change', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('auth-change', handleStorageChange);
        };
    }, [currentUser]);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (currentUser) {
            const cartKey = `cart_${currentUser}`;
            localStorage.setItem(cartKey, JSON.stringify(cartItems));
        }
    }, [cartItems, currentUser]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            
            return [...prevItems, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    // Merge guest cart with user cart when logging in
    const mergeGuestCart = () => {
        const guestCart = localStorage.getItem('cart_guest');
        if (guestCart && currentUser && !currentUser.startsWith('guest')) {
            const guestItems = JSON.parse(guestCart);
            if (guestItems.length > 0) {
                setCartItems(prevItems => {
                    const merged = [...prevItems];
                    guestItems.forEach(guestItem => {
                        const existingIndex = merged.findIndex(item => item.id === guestItem.id);
                        if (existingIndex >= 0) {
                            merged[existingIndex].quantity += guestItem.quantity;
                        } else {
                            merged.push(guestItem);
                        }
                    });
                    return merged;
                });
                // Clear guest cart after merging
                localStorage.removeItem('cart_guest');
            }
        }
    };

    // Merge guest cart when user logs in
    useEffect(() => {
        if (currentUser && !currentUser.startsWith('guest')) {
            mergeGuestCart();
        }
    }, [currentUser]);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getCartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
