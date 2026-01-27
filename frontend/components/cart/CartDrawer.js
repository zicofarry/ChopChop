'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
    const { user, token } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleCheckout = async () => {
        if (!user) {
            closeCart();
            router.push('/auth/login');
            return;
        }

        if (items.length === 0) return;

        setLoading(true);
        try {
            const orderData = {
                items: items.map((item) => ({
                    menu: item._id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
                totalPrice,
                paymentMethod: 'cash',
            };

            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(orderData),
            });

            if (res.ok) {
                setOrderSuccess(true);
                clearCart();
                setTimeout(() => {
                    setOrderSuccess(false);
                    closeCart();
                    router.push('/dashboard');
                }, 2000);
            } else {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Order failed');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert(`Failed to place order: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 transition-opacity"
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[var(--card)] z-50 shadow-2xl flex flex-col animate-slideIn">
                {/* Header */}
                <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
                    <h2 className="text-xl font-bold">Your Cart</h2>
                    <button
                        onClick={closeCart}
                        className="p-2 hover:bg-[var(--secondary)] rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Success Message */}
                {orderSuccess && (
                    <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-center">
                        <span className="text-2xl block mb-2">✅</span>
                        Order placed successfully! Redirecting...
                    </div>
                )}

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {items.length === 0 ? (
                        <div className="text-center py-12">
                            <span className="text-6xl block mb-4">🛒</span>
                            <p className="text-[var(--muted)]">Your cart is empty</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item._id} className="flex gap-4 p-4 bg-[var(--secondary)] rounded-xl">
                                    {/* Image */}
                                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-[var(--primary)]/20 flex items-center justify-center">
                                                <span className="text-2xl">{item.category?.icon || '☕'}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium truncate">{item.name}</h3>
                                        <p className="text-[var(--primary)] font-semibold">{formatPrice(item.price)}</p>

                                        {/* Quantity Controls */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                className="w-8 h-8 rounded-full bg-[var(--card)] flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                className="w-8 h-8 rounded-full bg-[var(--card)] flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Remove */}
                                    <button
                                        onClick={() => removeItem(item._id)}
                                        className="text-red-500 hover:text-red-600 p-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-6 border-t border-[var(--border)] space-y-4">
                        {/* Total */}
                        <div className="flex items-center justify-between text-lg">
                            <span className="font-medium">Total</span>
                            <span className="font-bold text-[var(--primary)]">{formatPrice(totalPrice)}</span>
                        </div>

                        {/* Checkout Button */}
                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Processing...
                                </span>
                            ) : user ? 'Place Order' : 'Login to Order'}
                        </button>

                        {/* Clear Cart */}
                        <button
                            onClick={clearCart}
                            className="w-full text-center text-[var(--muted)] hover:text-red-500 transition-colors"
                        >
                            Clear Cart
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
        </>
    );
}
