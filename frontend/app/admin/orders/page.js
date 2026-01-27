'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminOrdersPage() {
    const router = useRouter();
    const { user, token, isAdmin, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (!authLoading) {
            if (!user) router.push('/auth/login');
            else if (!isAdmin) router.push('/dashboard');
            else fetchOrders();
        }
    }, [user, isAdmin, authLoading]);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API_URL}/orders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await fetch(`${API_URL}/orders/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            fetchOrders();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
            preparing: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
            ready: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        };
        return colors[status] || colors.pending;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(order => order.status === filter);

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
                    <Link href="/admin" className="text-[var(--primary)] text-sm hover:underline mb-2 block">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold">Order Management</h1>
                </div>
            </section>

            {/* Filter */}
            <section className="py-4 border-b border-[var(--border)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--secondary)]'
                                }`}
                        >
                            All ({orders.length})
                        </button>
                        {statuses.map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${filter === status ? 'bg-[var(--primary)] text-white' : 'bg-[var(--secondary)]'
                                    }`}
                            >
                                {status} ({orders.filter(o => o.status === status).length})
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Orders List */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="grid gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="card p-6 animate-pulse">
                                    <div className="h-6 bg-[var(--secondary)] rounded w-1/4 mb-4" />
                                    <div className="h-4 bg-[var(--secondary)] rounded w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : filteredOrders.length > 0 ? (
                        <div className="grid gap-4">
                            {filteredOrders.map((order) => (
                                <div key={order._id} className="card p-6">
                                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                                <span className="text-[var(--muted)] text-sm">
                                                    {formatDate(order.createdAt)}
                                                </span>
                                            </div>
                                            <p className="font-medium">{order.user?.name || 'Unknown'}</p>
                                            <p className="text-sm text-[var(--muted)]">{order.user?.email}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold">{formatPrice(order.totalPrice)}</p>
                                            <p className="text-sm text-[var(--muted)]">{order.paymentMethod || 'Cash'}</p>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div className="border-t border-[var(--border)] pt-4 mb-4">
                                        <p className="text-sm font-medium mb-2">Items:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {order.items?.map((item, idx) => (
                                                <span key={idx} className="bg-[var(--secondary)] px-3 py-1 rounded-full text-sm">
                                                    {item.name || item.menu?.name || 'Item'} x{item.quantity}
                                                </span>
                                            ))}
                                        </div>
                                        {order.notes && (
                                            <p className="mt-2 text-sm text-[var(--muted)]">Note: {order.notes}</p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-wrap gap-2">
                                        {order.status !== 'completed' && order.status !== 'cancelled' && (
                                            <>
                                                {order.status === 'pending' && (
                                                    <button
                                                        onClick={() => updateStatus(order._id, 'confirmed')}
                                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                                                    >
                                                        Confirm
                                                    </button>
                                                )}
                                                {order.status === 'confirmed' && (
                                                    <button
                                                        onClick={() => updateStatus(order._id, 'preparing')}
                                                        className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
                                                    >
                                                        Start Preparing
                                                    </button>
                                                )}
                                                {order.status === 'preparing' && (
                                                    <button
                                                        onClick={() => updateStatus(order._id, 'ready')}
                                                        className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                                                    >
                                                        Mark Ready
                                                    </button>
                                                )}
                                                {order.status === 'ready' && (
                                                    <button
                                                        onClick={() => updateStatus(order._id, 'completed')}
                                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
                                                    >
                                                        Complete
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => updateStatus(order._id, 'cancelled')}
                                                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card p-12 text-center">
                            <span className="text-6xl block mb-4">📦</span>
                            <h3 className="text-xl font-semibold mb-2">No orders found</h3>
                            <p className="text-[var(--muted)]">
                                {filter !== 'all' ? `No ${filter} orders` : 'Orders will appear here'}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
