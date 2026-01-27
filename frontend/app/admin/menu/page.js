'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminMenuPage() {
    const router = useRouter();
    const { user, token, isAdmin, loading: authLoading } = useAuth();
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        available: true,
        featured: false
    });

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/auth/login');
            } else if (!isAdmin) {
                router.push('/dashboard');
            } else {
                fetchData();
            }
        }
    }, [user, isAdmin, authLoading]);

    const fetchData = async () => {
        try {
            const [menuRes, catRes] = await Promise.all([
                fetch(`${API_URL}/menu`),
                fetch(`${API_URL}/categories`)
            ]);
            const menuData = await menuRes.json();
            const catData = await catRes.json();

            if (Array.isArray(menuData)) setMenuItems(menuData);
            if (Array.isArray(catData)) setCategories(catData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const method = editItem ? 'PUT' : 'POST';
        const url = editItem ? `${API_URL}/menu/${editItem._id}` : `${API_URL}/menu`;

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    price: Number(formData.price)
                })
            });

            if (res.ok) {
                fetchData();
                setShowModal(false);
                setEditItem(null);
                setFormData({ name: '', description: '', price: '', category: '', image: '', available: true, featured: false });
            }
        } catch (error) {
            console.error('Failed to save menu:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            await fetch(`${API_URL}/menu/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchData();
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    const openEditModal = (item) => {
        setEditItem(item);
        setFormData({
            name: item.name,
            description: item.description || '',
            price: item.price.toString(),
            category: item.category?._id || '',
            image: item.image || '',
            available: item.available,
            featured: item.featured
        });
        setShowModal(true);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (authLoading || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <section className="py-8 bg-gradient-to-br from-[var(--secondary)] to-[var(--background)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link href="/admin" className="text-[var(--primary)] text-sm hover:underline mb-2 block">
                                ← Back to Dashboard
                            </Link>
                            <h1 className="text-3xl font-bold">Menu Management</h1>
                        </div>
                        <button
                            onClick={() => {
                                setEditItem(null);
                                setFormData({ name: '', description: '', price: '', category: '', image: '', available: true, featured: false });
                                setShowModal(true);
                            }}
                            className="btn-primary"
                        >
                            + Add Menu Item
                        </button>
                    </div>
                </div>
            </section>

            {/* Menu Table */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="card overflow-hidden">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary)] mx-auto"></div>
                            </div>
                        ) : menuItems.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[var(--secondary)]">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Item</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                            <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[var(--border)]">
                                        {menuItems.map((item) => (
                                            <tr key={item._id} className="hover:bg-[var(--secondary)]/50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--secondary)]">
                                                            {item.image ? (
                                                                <Image
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                                                    {item.category?.icon || '☕'}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-lg">{item.name}</div>
                                                            <div className="text-sm text-[var(--muted)] line-clamp-1 max-w-xs">
                                                                {item.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium">{item.category?.name || 'N/A'}</td>
                                                <td className="px-6 py-4 font-bold text-[var(--primary)]">{formatPrice(item.price)}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1 items-start">
                                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${item.available
                                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                                            }`}>
                                                            {item.available ? 'Available' : 'Unavailable'}
                                                        </span>
                                                        {item.featured && (
                                                            <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                                                Featured
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => openEditModal(item)}
                                                        className="text-[var(--primary)] hover:underline mr-4 font-medium"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item._id)}
                                                        className="text-red-500 hover:underline font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <span className="text-6xl block mb-4">📋</span>
                                <h3 className="text-xl font-semibold mb-2">No menu items yet</h3>
                                <p className="text-[var(--muted)]">Add your first menu item to get started</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="card p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
                        <h2 className="text-2xl font-bold mb-6">
                            {editItem ? 'Edit Menu Item' : 'Add Menu Item'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    rows={2}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Price (IDR)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Category</label>
                                    <select
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                    >
                                        <option value="">Select category</option>
                                        {categories.map((cat) => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Image URL/Path</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="/images/your-image.png"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                    />
                                </div>
                                <p className="text-xs text-[var(--muted)] mt-1">Leave empty to use category placeholder</p>
                            </div>
                            <div className="flex gap-6 pt-2">
                                <label className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-[var(--secondary)]">
                                    <input
                                        type="checkbox"
                                        checked={formData.available}
                                        onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                                        className="rounded accent-[var(--primary)] w-5 h-5"
                                    />
                                    <span className="font-medium">Available</span>
                                </label>
                                <label className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-[var(--secondary)]">
                                    <input
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                        className="rounded accent-[var(--primary)] w-5 h-5"
                                    />
                                    <span className="font-medium">Featured</span>
                                </label>
                            </div>
                            <div className="flex gap-4 pt-6">
                                <button type="submit" className="btn-primary flex-1">
                                    {editItem ? 'Update Item' : 'Create Item'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
