'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getCafeOrders, updateOrderStatus, verifyPayment } from '@/lib/api';

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
            const data = await getCafeOrders(token);
            if (Array.isArray(data)) setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await updateOrderStatus(id, status, token);
            fetchOrders();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleVerifyPayment = async (id) => {
        try {
            await verifyPayment(id, token);
            fetchOrders();
        } catch (error) {
            console.error('Failed to verify payment:', error);
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
            <section className="py-8 bg-gradient-to-br from-[var(--secondary)] to-[var(--background)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link href="/admin" className="text-[var(--primary)] text-sm hover:underline mb-2 block">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold">Order Management</h1>
                </div>
            </section>

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
                                                {order.tableNumber && (
                                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                                                        Meja {order.tableNumber}
                                                    </span>
                                                )}
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.paymentStatus === 'paid'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                    }`}>
                                                    {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                                                </span>
                                            </div>
                                            <p className="font-medium">
                                                {order.customerName || order.user?.name || 'Guest'}
                                            </p>
                                            {order.customerName && (
                                                <p className="text-sm text-[var(--muted)]">Guest</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold">{formatPrice(order.totalPrice)}</p>
                                            <p className="text-sm text-[var(--muted)] capitalize">{order.paymentMethod}</p>
                                        </div>
                                    </div>

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

                                    <div className="flex flex-wrap gap-2">
                                        {order.paymentStatus !== 'paid' && (
                                            <button
                                                onClick={() => handleVerifyPayment(order._id)}
                                                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                                            >
                                                Verifikasi Pembayaran
                                            </button>
                                        )}
                                        {order.status !== 'completed' && order.status !== 'cancelled' && (
                                            <>
                                                {order.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(order._id, 'confirmed')}
                                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                                                    >
                                                        Confirm
                                                    </button>
                                                )}
                                                {order.status === 'confirmed' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(order._id, 'preparing')}
                                                        className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
                                                    >
                                                        Start Preparing
                                                    </button>
                                                )}
                                                {order.status === 'preparing' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(order._id, 'ready')}
                                                        className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                                                    >
                                                        Mark Ready
                                                    </button>
                                                )}
                                                {order.status === 'ready' && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(order._id, 'completed')}
                                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
                                                    >
                                                        Complete
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleUpdateStatus(order._id, 'cancelled')}
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
                            <svg className="w-16 h-16 mx-auto mb-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
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
