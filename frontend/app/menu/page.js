'use client';

import { useState, useEffect } from 'react';
import MenuCard from '@/components/menu/MenuCard';
import { getAllMenu, getAllCategories } from '@/lib/api';

export default function MenuPage() {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [menuData, categoryData] = await Promise.all([
                getAllMenu(),
                getAllCategories()
            ]);

            if (Array.isArray(menuData)) setMenuItems(menuData);
            if (Array.isArray(categoryData)) setCategories(categoryData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Placeholder data
    const placeholderCategories = [
        { _id: '1', name: 'Coffee', icon: '☕' },
        { _id: '2', name: 'Non-Coffee', icon: '🍵' },
        { _id: '3', name: 'Pastry', icon: '🥐' },
        { _id: '4', name: 'Dessert', icon: '🍰' },
    ];

    const placeholderMenu = [
        { _id: '1', name: 'Signature Latte', description: 'Our house special with caramel and vanilla notes', price: 42000, image: '/images/signature_latte.png', category: { _id: '1', name: 'Coffee', icon: '☕' } },
        { _id: '2', name: 'Cold Brew', description: 'Smooth, bold coffee steeped for 20 hours', price: 38000, image: '/images/cold_brew.png', category: { _id: '1', name: 'Coffee', icon: '☕' } },
        { _id: '3', name: 'Cappuccino', description: 'Perfect balance of espresso and steamed milk', price: 35000, image: '/images/cappuccino.png', category: { _id: '1', name: 'Coffee', icon: '☕' } },
        { _id: '4', name: 'Espresso', description: 'Pure, intense coffee shot', price: 25000, image: '/images/espresso.png', category: { _id: '1', name: 'Coffee', icon: '☕' } },
        { _id: '5', name: 'Affogato', description: 'Espresso over vanilla gelato', price: 48000, image: '/images/affogato.png', category: { _id: '1', name: 'Coffee', icon: '☕' } },
        { _id: '6', name: 'Matcha Latte', description: 'Premium Japanese matcha with creamy milk', price: 45000, image: '/images/matcha_latte.png', category: { _id: '2', name: 'Non-Coffee', icon: '🍵' } },
        { _id: '7', name: 'Chai Latte', description: 'Spiced tea with steamed milk', price: 40000, image: '/images/chai_latte.png', category: { _id: '2', name: 'Non-Coffee', icon: '🍵' } },
        { _id: '8', name: 'Hot Chocolate', description: 'Rich Belgian chocolate', price: 38000, image: '/images/hot_chocolate.png', category: { _id: '2', name: 'Non-Coffee', icon: '🍵' } },
        { _id: '9', name: 'Croissant', description: 'Buttery, flaky French-style pastry', price: 28000, image: '/images/croissant.png', category: { _id: '3', name: 'Pastry', icon: '🥐' } },
        { _id: '10', name: 'Pain au Chocolat', description: 'Chocolate-filled croissant', price: 32000, image: '/images/pain_au_chocolat.png', category: { _id: '3', name: 'Pastry', icon: '🥐' } },
        { _id: '11', name: 'Tiramisu', description: 'Classic Italian coffee-flavored dessert', price: 52000, image: '/images/tiramisu.png', category: { _id: '4', name: 'Dessert', icon: '🍰' } },
        { _id: '12', name: 'Cheesecake', description: 'New York style creamy cheesecake', price: 48000, image: '/images/cheesecake.png', category: { _id: '4', name: 'Dessert', icon: '🍰' } },
    ];

    const displayCategories = categories.length > 0 ? categories : placeholderCategories;
    const displayMenu = menuItems.length > 0 ? menuItems : placeholderMenu;

    const filteredMenu = selectedCategory === 'all'
        ? displayMenu
        : displayMenu.filter(item => item.category?._id === selectedCategory);

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="py-16 bg-gradient-to-br from-[var(--secondary)] to-[var(--background)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-[var(--accent)] font-medium text-sm uppercase tracking-wider">
                        Our Menu
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
                        <span className="gradient-text">Discover Our Selection</span>
                    </h1>
                    <p className="text-[var(--muted)] max-w-2xl mx-auto">
                        From classic espresso to signature creations, explore our carefully curated menu
                        designed to delight every palate.
                    </p>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 bg-[var(--background)] sticky top-20 z-40 border-b border-[var(--border)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === 'all'
                                ? 'bg-[var(--primary)] text-white'
                                : 'bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--primary)]/10'
                                }`}
                        >
                            All
                        </button>
                        {displayCategories.map((category) => (
                            <button
                                key={category._id}
                                onClick={() => setSelectedCategory(category._id)}
                                className={`px-6 py-2 rounded-full font-medium transition-all flex items-center space-x-2 ${selectedCategory === category._id
                                    ? 'bg-[var(--primary)] text-white'
                                    : 'bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--primary)]/10'
                                    }`}
                            >
                                <span>{category.icon}</span>
                                <span>{category.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Menu Grid */}
            <section className="py-16 bg-[var(--background)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <div key={i} className="card p-6 animate-pulse">
                                    <div className="h-48 bg-[var(--secondary)] rounded-xl mb-4" />
                                    <div className="h-6 bg-[var(--secondary)] rounded w-3/4 mb-2" />
                                    <div className="h-4 bg-[var(--secondary)] rounded w-full" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {filteredMenu.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredMenu.map((item) => (
                                        <MenuCard key={item._id} item={item} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16">
                                    <span className="text-6xl mb-4 block">🔍</span>
                                    <h3 className="text-xl font-semibold text-[var(--foreground)]">No items found</h3>
                                    <p className="text-[var(--muted)]">Try selecting a different category</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
