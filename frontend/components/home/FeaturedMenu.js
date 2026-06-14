'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedMenu } from '@/lib/api';
import { useCart } from '@/context/CartContext';

function MenuItemCard({ item }) {
    const { addItem } = useCart();
    const [added, setAdded] = useState(false);

    const formatPrice = (price) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

    const handleAdd = () => {
        addItem(item);
        setAdded(true);
        setTimeout(() => { setAdded(false); }, 1000);
    };

    return (
        <div className="bg-card-bg rounded-xl border border-border overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300">
            <div className="relative h-44 sm:h-48 bg-secondary">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-12 h-12 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                )}
            </div>
            <div className="p-4 sm:p-5">
                <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1">
                    {item.name}
                </h3>
                <p className="text-muted text-xs sm:text-sm line-clamp-2 mb-3">
                    {item.description}
                </p>
                <div className="flex items-center justify-between">
                    <span className="font-bold text-accent text-sm sm:text-base">
                        {formatPrice(item.price)}
                    </span>
                    <button
                        onClick={handleAdd}
                        disabled={added}
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all
                            ${added
                                ? 'bg-green-600 text-white'
                                : 'bg-primary text-white hover:bg-primary-dark'
                            }`}
                    >
                        {added ? 'Added' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function FeaturedMenu() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedMenu();
    }, []);

    const fetchFeaturedMenu = async () => {
        try {
            const data = await getFeaturedMenu();
            if (Array.isArray(data)) setMenuItems(data.slice(0, 6));
        } catch (error) {
            console.error('Failed to fetch featured menu:', error);
        } finally {
            setLoading(false);
        }
    };

    const placeholderItems = [
        { _id: '1', name: 'Signature Latte', description: 'Our house special with caramel and vanilla notes', price: 42000, image: '/images/signature_latte.png', category: { name: 'Coffee' } },
        { _id: '2', name: 'Cold Brew', description: 'Smooth, bold coffee steeped for 20 hours', price: 38000, image: '/images/cold_brew.png', category: { name: 'Coffee' } },
        { _id: '3', name: 'Matcha Latte', description: 'Premium Japanese matcha with creamy milk', price: 45000, image: '/images/matcha_latte.png', category: { name: 'Non-Coffee' } },
        { _id: '4', name: 'Croissant', description: 'Buttery, flaky French-style pastry', price: 28000, image: '/images/croissant.png', category: { name: 'Pastry' } },
        { _id: '5', name: 'Affogato', description: 'Espresso over vanilla gelato', price: 48000, image: '/images/affogato.png', category: { name: 'Coffee' } },
        { _id: '6', name: 'Tiramisu', description: 'Classic Italian coffee-flavored dessert', price: 52000, image: '/images/tiramisu.png', category: { name: 'Dessert' } },
    ];

    const displayItems = menuItems.length > 0 ? menuItems : placeholderItems;

    return (
        <section className="py-16 sm:py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 sm:mb-14">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
                        Featured Menu
                    </h2>
                    <p className="text-muted text-sm sm:text-base max-w-xl mx-auto">
                        Our most loved creations, crafted with the finest ingredients
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="rounded-xl bg-secondary animate-pulse">
                                <div className="h-44 sm:h-48 rounded-t-xl bg-secondary-dark" />
                                <div className="p-4 sm:p-5 space-y-3">
                                    <div className="h-4 bg-secondary-dark rounded w-3/4" />
                                    <div className="h-3 bg-secondary-dark rounded w-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                        {displayItems.map((item) => (
                            <MenuItemCard key={item._id} item={item} />
                        ))}
                    </div>
                )}

                <div className="text-center mt-10 sm:mt-12">
                    <Link
                        href="/menu"
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
                    >
                        View Full Menu
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
