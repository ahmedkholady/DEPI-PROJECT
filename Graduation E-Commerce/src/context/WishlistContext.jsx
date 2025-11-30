import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    // Get current user email/ID for unique wishlist storage
    const getUserIdentifier = () => {
        const email = localStorage.getItem('email');
        const token = localStorage.getItem('auth_token');
        return email || (token ? 'guest_' + token.substring(0, 10) : 'guest');
    };

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const userIdentifier = getUserIdentifier();
        setCurrentUser(userIdentifier);
        
        const wishlistKey = `wishlist_${userIdentifier}`;
        const savedWishlist = localStorage.getItem(wishlistKey);
        if (savedWishlist) {
            setWishlistItems(JSON.parse(savedWishlist));
        } else {
            setWishlistItems([]);
        }
    }, []);

    // Listen for auth changes (login/logout)
    useEffect(() => {
        const handleStorageChange = () => {
            const newUserIdentifier = getUserIdentifier();
            if (newUserIdentifier !== currentUser) {
                setCurrentUser(newUserIdentifier);
                const wishlistKey = `wishlist_${newUserIdentifier}`;
                const savedWishlist = localStorage.getItem(wishlistKey);
                if (savedWishlist) {
                    setWishlistItems(JSON.parse(savedWishlist));
                } else {
                    setWishlistItems([]);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('auth-change', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('auth-change', handleStorageChange);
        };
    }, [currentUser]);

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        if (currentUser) {
            const wishlistKey = `wishlist_${currentUser}`;
            localStorage.setItem(wishlistKey, JSON.stringify(wishlistItems));
        }
    }, [wishlistItems, currentUser]);

    const addToWishlist = (productId) => {
        setWishlistItems(prevItems => {
            if (!prevItems.includes(productId)) {
                return [...prevItems, productId];
            }
            return prevItems;
        });
    };

    const removeFromWishlist = (productId) => {
        setWishlistItems(prevItems => prevItems.filter(id => id !== productId));
    };

    const toggleWishlist = (productId) => {
        setWishlistItems(prevItems => {
            if (prevItems.includes(productId)) {
                return prevItems.filter(id => id !== productId);
            }
            return [...prevItems, productId];
        });
    };

    const isInWishlist = (productId) => {
        return wishlistItems.includes(productId);
    };

    const clearWishlist = () => {
        setWishlistItems([]);
    };

    const getWishlistCount = () => {
        return wishlistItems.length;
    };

    // Merge guest wishlist with user wishlist when logging in
    const mergeGuestWishlist = () => {
        const guestWishlist = localStorage.getItem('wishlist_guest');
        if (guestWishlist && currentUser && !currentUser.startsWith('guest')) {
            const guestItems = JSON.parse(guestWishlist);
            if (guestItems.length > 0) {
                setWishlistItems(prevItems => {
                    const merged = [...new Set([...prevItems, ...guestItems])];
                    return merged;
                });
                // Clear guest wishlist after merging
                localStorage.removeItem('wishlist_guest');
            }
        }
    };

    // Merge guest wishlist when user logs in
    useEffect(() => {
        if (currentUser && !currentUser.startsWith('guest')) {
            mergeGuestWishlist();
        }
    }, [currentUser]);

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                addToWishlist,
                removeFromWishlist,
                toggleWishlist,
                isInWishlist,
                clearWishlist,
                getWishlistCount,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};
