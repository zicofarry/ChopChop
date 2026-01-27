'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MenuCard from '@/components/menu/MenuCard';
import { getFeaturedMenu } from '@/lib/api';

export default function FeaturedMenu() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedMenu();
    }, []);

    const fetchFeaturedMenu = async () => {
        try {
            const data = await getFeaturedMenu();
            if (Array.isArray(data)) {
                setMenuItems(data.slice(0, 6));
            }
        } catch (error) {
            console.error('Failed to fetch featured menu:', error);
        } finally {
            setLoading(false);
        }
    };

    // Placeholder data for demo
    const placeholderItems = [
        {
            _id: '1',
            name: 'Signature Latte',
            description: 'Our house special with caramel and vanilla notes',
            price: 42000,
            image: '/images/signature_latte.png',
            category: { name: 'Coffee', icon: '☕' }
        },
        {
            _id: '2',
            name: 'Cold Brew',
            description: 'Smooth, bold coffee steeped for 20 hours',
            price: 38000,
            image: '/images/cold_brew.png',
            category: { name: 'Coffee', icon: '☕' }
        },
        {
            _id: '3',
            name: 'Matcha Latte',
            description: 'Premium Japanese matcha with creamy milk',
            price: 45000,
            image: '/images/matcha_latte.png',
            category: { name: 'Non-Coffee', icon: '🍵' }
        },
        {
            _id: '4',
            name: 'Croissant',
            description: 'Buttery, flaky French-style pastry',
            price: 28000,
            image: '/images/croissant.png',
            category: { name: 'Pastry', icon: '🥐' }
        },
        {
            _id: '5',
            name: 'Affogato',
            description: 'Espresso over vanilla gelato',
            price: 48000,
            image: '/images/affogato.png',
            category: { name: 'Coffee', icon: '☕' }
        },
        {
            _id: '6',
            name: 'Tiramisu',
            description: 'Classic Italian coffee-flavored dessert',
            price: 52000,
            image: '/images/tiramisu.png',
            category: { name: 'Dessert', icon: '🍰' }
        },
    ];

    const displayItems = menuItems.length > 0 ? menuItems : placeholderItems;

    return (
        <section className="py-20 bg-[var(--background)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="text-[var(--accent)] font-medium text-sm uppercase tracking-wider">
                        Our Specialties
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
                        <span className="gradient-text">Featured Menu</span>
                    </h2>
                    <p className="text-[var(--muted)] max-w-2xl mx-auto">
                        Discover our most loved creations, carefully crafted by our expert baristas
                        using the finest ingredients.
                    </p>
                </div>

                {/* Menu Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="card p-6 animate-pulse">
                                <div className="h-48 bg-[var(--secondary)] rounded-xl mb-4" />
                                <div className="h-6 bg-[var(--secondary)] rounded w-3/4 mb-2" />
                                <div className="h-4 bg-[var(--secondary)] rounded w-full" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
                        {displayItems.map((item) => (
                            <MenuCard key={item._id} item={item} />
                        ))}
                    </div>
                )}

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link href="/menu" className="btn-secondary inline-flex items-center space-x-2">
                        <span>View Full Menu</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
