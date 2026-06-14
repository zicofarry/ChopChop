'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import MenuCard from '@/components/menu/MenuCard';
import { useCart } from '@/context/CartContext';
import { getTableByToken, getAllMenu, getAllCategories } from '@/lib/api';

export default function OrderPage() {
    const { token } = useParams();
    const { totalItems, setOrderContext } = useCart();
    const [table, setTable] = useState(null);
    const [cafe, setCafe] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (token) fetchData();
    }, [token]);

    const fetchData = async () => {
        try {
            const tableData = await getTableByToken(token);
            if (!tableData._id) {
                setError('Meja tidak ditemukan');
                setLoading(false);
                return;
            }

            setTable(tableData);
            setCafe(tableData.cafe);
            setOrderContext(tableData.tableNumber, tableData.cafe?._id);

            const [menuData, categoryData] = await Promise.all([
                getAllMenu(tableData.cafe?._id),
                getAllCategories(tableData.cafe?._id)
            ]);

            if (Array.isArray(menuData)) setMenuItems(menuData);
            if (Array.isArray(categoryData)) setCategories(categoryData);
        } catch (err) {
            setError('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <h2 className="text-2xl font-bold mb-2">Meja Tidak Ditemukan</h2>
                    <p className="text-[var(--muted)]">Scan QR code yang valid untuk memesan</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
            </div>
        );
    }

    const filteredMenu = selectedCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category?._id === selectedCategory);

    return (
        <div className="min-h-screen">
            <section className="py-8 bg-gradient-to-br from-[var(--secondary)] to-[var(--background)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">
                                {cafe?.name || 'Menu'}
                            </h1>
                            {table && (
                                <p className="text-[var(--muted)] flex items-center gap-2 mt-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    Meja {table.tableNumber}
                                </p>
                            )}
                        </div>
                        <Link
                            href="/cart"
                            className="relative p-3 bg-[var(--primary)] text-white rounded-full hover:bg-[var(--primary-dark)] transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                    {totalItems > 9 ? '9+' : totalItems}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-4 bg-[var(--background)] sticky top-0 z-40 border-b border-[var(--border)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-5 py-2 rounded-full font-medium whitespace-nowrap transition-all ${selectedCategory === 'all'
                                ? 'bg-[var(--primary)] text-white'
                                : 'bg-[var(--secondary)] text-[var(--foreground)]'
                                }`}
                        >
                            Semua
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat._id}
                                onClick={() => setSelectedCategory(cat._id)}
                                className={`px-5 py-2 rounded-full font-medium whitespace-nowrap transition-all flex items-center gap-2 ${selectedCategory === cat._id
                                    ? 'bg-[var(--primary)] text-white'
                                    : 'bg-[var(--secondary)] text-[var(--foreground)]'
                                    }`}
                            >
                                <span>{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-8 bg-[var(--background)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredMenu.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredMenu.map((item) => (
                                <MenuCard key={item._id} item={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <svg className="w-16 h-16 mx-auto mb-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v8m-4-3h8M12 2a10 10 0 110 20 10 10 0 010-20z" /></svg>
                            <p className="text-[var(--muted)]">Tidak ada menu di kategori ini</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
