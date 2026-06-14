'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { getStats } from '@/lib/api';

export default function AdminDashboard() {
    const router = useRouter();
    const { user, token, isAdmin, loading: authLoading } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push('/auth/login');
            } else if (!isAdmin) {
                router.push('/dashboard');
            } else {
                fetchStats();
            }
        }
    }, [user, isAdmin, authLoading]);

    const fetchStats = async () => {
        try {
            const data = await getStats(token);
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
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
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (authLoading || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
            </div>
        );
    }

    const adminLinks = [
        {
            title: 'Menu Management',
            description: 'Add, edit, or remove menu items',
            icon: '/images/croissant.png',
            href: '/admin/menu',
            color: 'from-amber-500 to-orange-600'
        },
        {
            title: 'Orders',
            description: 'View and manage customer orders',
            icon: '/images/signature_latte.png',
            href: '/admin/orders',
            color: 'from-blue-500 to-cyan-600'
        },
        {
            title: 'Testimonials',
            description: 'Approve customer testimonials',
            icon: '/images/tiramisu.png',
            href: '/admin/testimonials',
            color: 'from-purple-500 to-pink-600'
        },
        {
            title: 'Tables',
            description: 'Manage tables and QR codes',
            icon: '/images/espresso.png',
            href: '/admin/tables',
            color: 'from-red-500 to-rose-600'
        },
    ];

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <section className="py-12 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                            <p className="text-white/70 mt-2">Manage your coffee shop</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                            <span className="text-white/70 text-sm">Logged in as</span>
                            <span className="text-white font-medium ml-2">{user?.name}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="py-8 -mt-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        <div className="card p-5 md:p-6">
                            <p className="text-[var(--muted)] text-xs md:text-sm">Menu Items</p>
                            <p className="text-2xl md:text-3xl font-bold mt-1">
                                {loading ? '...' : stats?.overview?.totalMenuItems || 0}
                            </p>
                        </div>
                        <div className="card p-5 md:p-6">
                            <p className="text-[var(--muted)] text-xs md:text-sm">Pending Orders</p>
                            <p className="text-2xl md:text-3xl font-bold mt-1">
                                {loading ? '...' : stats?.pending?.orders || 0}
                            </p>
                        </div>
                        <div className="card p-5 md:p-6">
                            <p className="text-[var(--muted)] text-xs md:text-sm">Today's Revenue</p>
                            <p className="text-xl md:text-2xl font-bold mt-1 text-[var(--primary)]">
                                {loading ? '...' : formatPrice(stats?.today?.revenue || 0)}
                            </p>
                        </div>
                        <div className="card p-5 md:p-6">
                            <p className="text-[var(--muted)] text-xs md:text-sm">Tables</p>
                            <p className="text-2xl md:text-3xl font-bold mt-1">
                                {loading ? '...' : stats?.overview?.totalTables || 0}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Admin Links */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold mb-8">Quick Actions</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {adminLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="card p-6 hover:-translate-y-2 group"
                            >
                                <div className={`w-16 h-16 rounded-2xl overflow-hidden mb-4 group-hover:scale-110 transition-transform`}>
                                    <Image
                                        src={link.icon}
                                        alt={link.title}
                                        width={64}
                                        height={64}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{link.title}</h3>
                                <p className="text-[var(--muted)] text-sm">{link.description}</p>
                                <div className="mt-4 text-[var(--primary)] text-sm font-medium group-hover:underline">
                                    Manage →
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recent Activity */}
            <section className="py-12 bg-[var(--secondary)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold mb-8">Recent Orders</h2>
                    <div className="card divide-y divide-[var(--border)]">
                        {loading ? (
                            <div className="p-8 text-center text-[var(--muted)]">Loading...</div>
                        ) : stats?.recent?.orders?.length > 0 ? (
                            stats.recent.orders.map((order) => (
                                <div key={order._id} className="p-4 flex items-center space-x-4">
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                        <Image src="/images/signature_latte.png" alt="Order" fill className="object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">
                                            Order from {order.user?.name || 'Customer'}
                                        </p>
                                        <p className="text-sm text-[var(--muted)]">
                                            {formatPrice(order.totalPrice)} • {order.items?.length || 0} items
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                        <p className="text-xs text-[var(--muted)] mt-1">{formatDate(order.createdAt)}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-[var(--muted)]">
                                No recent orders
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
