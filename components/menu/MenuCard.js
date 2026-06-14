'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function MenuCard({ item }) {
    const { addItem } = useCart();
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
        setTimeout(() => setAdded(false), 800);
    };

    return (
        <div className="bg-card-bg rounded-xl border border-border overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48 sm:h-52 overflow-hidden bg-secondary">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-12 h-12 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                )}
                {item.featured && (
                    <div className="absolute top-3 left-3 bg-accent text-white text-xs font-medium px-2.5 py-1 rounded-full">
                        Featured
                    </div>
                )}
            </div>

            <div className="p-5">
                <div className="mb-1">
                    <span className="text-xs text-muted uppercase tracking-wider">
                        {item.category?.name || 'Menu'}
                    </span>
                </div>

                <h3 className="font-semibold text-foreground mb-1">
                    {item.name}
                </h3>

                <p className="text-muted text-sm mb-4 line-clamp-2">
                    {item.description}
                </p>

                <div className="flex items-center justify-between">
                    <span className="font-bold text-accent">
                        {formatPrice(item.price)}
                    </span>
                    <button
                        onClick={handleAddToCart}
                        className={`p-2 rounded-full transition-all ${added
                            ? 'bg-green-500 text-white scale-110'
                            : 'bg-secondary text-muted hover:bg-primary hover:text-white'
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
