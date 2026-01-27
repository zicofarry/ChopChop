'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getMyOrders, getMyReservations } from '@/lib/api';

export default function DashboardPage() {
    const router = useRouter();
    const { user, token, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login');
        } else if (user && token) {
            fetchData();
        }
    }, [user, authLoading, token]);

    const fetchData = async () => {
        try {
            const [ordersData, reservationsData] = await Promise.all([
                getMyOrders(token),
                getMyReservations(token)
            ]);

            if (Array.isArray(ordersData)) setOrders(ordersData);
            if (Array.isArray(reservationsData)) setReservations(reservationsData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

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
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    if (authLoading || (!user && !authLoading)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <section className="py-12 bg-gradient-to-br from-[var(--secondary)] to-[var(--background)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold">
                        Welcome back, <span className="gradient-text">{user?.name}!</span>
                    </h1>
                    <p className="text-[var(--muted)] mt-2">Manage your orders and reservations</p>
                </div>
            </section>

            {/* Dashboard Content */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[var(--muted)] text-sm">Total Orders</p>
                                    <p className="text-3xl font-bold">{orders.length}</p>
                                </div>
                                <span className="text-4xl">📦</span>
                            </div>
                        </div>
                        <div className="card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[var(--muted)] text-sm">Reservations</p>
                                    <p className="text-3xl font-bold">{reservations.length}</p>
                                </div>
                                <span className="text-4xl">📅</span>
                            </div>
                        </div>
                        <div className="card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[var(--muted)] text-sm">Member Since</p>
                                    <p className="text-lg font-bold">{user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</p>
                                </div>
                                <span className="text-4xl">⭐</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Recent Orders */}
                        <div className="card p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Recent Orders</h2>
                                <Link href="/dashboard/orders" className="text-[var(--primary)] text-sm hover:underline">
                                    View all →
                                </Link>
                            </div>

                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="animate-pulse p-4 rounded-lg bg-[var(--secondary)]">
                                            <div className="h-4 bg-[var(--border)] rounded w-1/2 mb-2" />
                                            <div className="h-3 bg-[var(--border)] rounded w-1/4" />
                                        </div>
                                    ))}
                                </div>
                            ) : orders.length > 0 ? (
                                <div className="space-y-4">
                                    {orders.slice(0, 5).map((order) => (
                                        <div key={order._id} className="p-4 rounded-lg bg-[var(--secondary)]">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium">{order.items?.length || 0} items</span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-[var(--muted)]">{formatDate(order.createdAt)}</span>
                                                <span className="font-semibold">{formatPrice(order.totalPrice)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <span className="text-4xl block mb-4">📭</span>
                                    <p className="text-[var(--muted)]">No orders yet</p>
                                    <Link href="/menu" className="text-[var(--primary)] hover:underline text-sm">
                                        Browse our menu →
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Recent Reservations */}
                        <div className="card p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">Reservations</h2>
                                <Link href="/reservation" className="text-[var(--primary)] text-sm hover:underline">
                                    Make reservation →
                                </Link>
                            </div>

                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="animate-pulse p-4 rounded-lg bg-[var(--secondary)]">
                                            <div className="h-4 bg-[var(--border)] rounded w-1/2 mb-2" />
                                            <div className="h-3 bg-[var(--border)] rounded w-1/4" />
                                        </div>
                                    ))}
                                </div>
                            ) : reservations.length > 0 ? (
                                <div className="space-y-4">
                                    {reservations.slice(0, 5).map((reservation) => (
                                        <div key={reservation._id} className="p-4 rounded-lg bg-[var(--secondary)]">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium">
                                                    {formatDate(reservation.date)} at {reservation.time}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                                                    {reservation.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-[var(--muted)]">
                                                {reservation.guests} guests
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <span className="text-4xl block mb-4">📅</span>
                                    <p className="text-[var(--muted)]">No reservations yet</p>
                                    <Link href="/reservation" className="text-[var(--primary)] hover:underline text-sm">
                                        Book a table →
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
