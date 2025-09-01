import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItemCount, setCartItemCount] = useState(0);

    const fetchCartCount = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            try {
                const res = await fetch(`http://localhost:5000/api/carts/${user.id}`);
                const data = await res.json();
                const count = data?.data?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                setCartItemCount(count);
            } catch (err) {
                console.error('Lỗi khi lấy giỏ hàng:', err);
                setCartItemCount(0);
            }
        } else {
            setCartItemCount(0);
        }
    };

    useEffect(() => {
        fetchCartCount();
    }, []);

    return (
        <CartContext.Provider value={{ cartItemCount, setCartItemCount, fetchCartCount }}>
            {children}
        </CartContext.Provider>
    );
};
