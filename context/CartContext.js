'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [tableNumber, setTableNumber] = useState(null);
    const [cafeId, setCafeId] = useState(null);

    useEffect(() => {
        const savedCart = localStorage.getItem('chopchop_cart');
        if (savedCart) {
            try {
                const parsed = JSON.parse(savedCart);
                setItems(parsed.items || []);
                setTableNumber(parsed.tableNumber || null);
                setCafeId(parsed.cafeId || null);
            } catch (e) {
                console.error('Failed to parse cart:', e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('chopchop_cart', JSON.stringify({ items, tableNumber, cafeId }));
    }, [items, tableNumber, cafeId]);

    const setOrderContext = (table, cafe) => {
        setTableNumber(table);
        setCafeId(cafe);
    };

    const addItem = (item) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find((i) => i._id === item._id);
            if (existingItem) {
                return prevItems.map((i) =>
                    i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prevItems, { ...item, quantity: 1 }];
        });
    };

    const removeItem = (itemId) => {
        setItems((prevItems) => prevItems.filter((i) => i._id !== itemId));
    };

    const updateQuantity = (itemId, quantity) => {
        if (quantity <= 0) {
            removeItem(itemId);
            return;
        }
        setItems((prevItems) =>
            prevItems.map((i) => (i._id === itemId ? { ...i, quantity } : i))
        );
    };

    const clearCart = () => {
        setItems([]);
        setTableNumber(null);
        setCafeId(null);
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                tableNumber,
                cafeId,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
                setOrderContext,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
