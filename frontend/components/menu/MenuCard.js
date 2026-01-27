'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function MenuCard({ item }) {
    const { addItem, openCart } = useCart();
    const [added, setAdded] = useState(false);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleAddToCart = () => {
        addItem(item);
        setAdded(true);

        // Show feedback then open cart
        setTimeout(() => {
            setAdded(false);
            openCart();
        }, 500);
    };

    return (
        <div className="card group overflow-hidden hover:-translate-y-2">
            {/* Image */}
            <div className="relative h-52 overflow-hidden">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 flex items-center justify-center">
                        <span className="text-6xl">{item.category?.icon || '☕'}</span>
                    </div>
                )}
                {item.featured && (
                    <div className="absolute top-4 left-4 bg-[var(--accent)] text-white text-xs font-medium px-3 py-1 rounded-full z-10">
                        Featured
                    </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Category */}
                <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm">{item.category?.icon}</span>
                    <span className="text-xs text-[var(--muted)] uppercase tracking-wider">
                        {item.category?.name || 'Menu'}
                    </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2 group-hover:text-[var(--primary)] transition-colors">
                    {item.name}
                </h3>

                {/* Description */}
                <p className="text-[var(--muted)] text-sm mb-4 line-clamp-2">
                    {item.description}
                </p>

                {/* Price and Action */}
                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[var(--primary)]">
                        {formatPrice(item.price)}
                    </span>
                    <button
                        onClick={handleAddToCart}
                        className={`p-2 rounded-full transition-all group/btn ${added
                                ? 'bg-green-500 text-white scale-110'
                                : 'bg-[var(--primary)]/10 hover:bg-[var(--primary)] hover:text-white'
                            }`}
                    >
                        {added ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
