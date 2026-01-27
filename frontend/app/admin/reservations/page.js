'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminReservationsPage() {
    const router = useRouter();
    const { user, token, isAdmin, loading: authLoading } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (!authLoading) {
            if (!user) router.push('/auth/login');
            else if (!isAdmin) router.push('/dashboard');
            else fetchReservations();
        }
    }, [user, isAdmin, authLoading]);

    const fetchReservations = async () => {
        try {
            const res = await fetch(`${API_URL}/reservations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setReservations(data);
        } catch (error) {
            console.error('Failed to fetch reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await fetch(`${API_URL}/reservations/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            fetchReservations();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const statuses = ['pending', 'confirmed', 'cancelled'];

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        };
        return colors[status] || colors.pending;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const filteredReservations = filter === 'all'
        ? reservations
        : reservations.filter(r => r.status === filter);

    // Group by date
    const groupedReservations = filteredReservations.reduce((acc, reservation) => {
        const date = new Date(reservation.date).toDateString();
        if (!acc[date]) acc[date] = [];
        acc[date].push(reservation);
        return acc;
    }, {});

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
                    <h1 className="text-3xl font-bold">Reservation Management</h1>
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
                            All ({reservations.length})
                        </button>
                        {statuses.map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${filter === status ? 'bg-[var(--primary)] text-white' : 'bg-[var(--secondary)]'
                                    }`}
                            >
                                {status} ({reservations.filter(r => r.status === status).length})
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reservations List */}
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
                    ) : Object.keys(groupedReservations).length > 0 ? (
                        <div className="space-y-8">
                            {Object.entries(groupedReservations).map(([date, dateReservations]) => (
                                <div key={date}>
                                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <span>📅</span>
                                        {formatDate(date)}
                                        <span className="text-sm font-normal text-[var(--muted)]">
                                            ({dateReservations.length} reservations)
                                        </span>
                                    </h2>
                                    <div className="grid gap-4">
                                        {dateReservations
                                            .sort((a, b) => a.time.localeCompare(b.time))
                                            .map((reservation) => (
                                                <div key={reservation._id} className="card p-6">
                                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <span className="text-2xl font-bold">{reservation.time}</span>
                                                                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(reservation.status)}`}>
                                                                    {reservation.status}
                                                                </span>
                                                            </div>
                                                            <p className="font-medium">{reservation.user?.name || 'Unknown'}</p>
                                                            <p className="text-sm text-[var(--muted)]">
                                                                {reservation.user?.email} • {reservation.user?.phone || 'No phone'}
                                                            </p>
                                                            <div className="mt-2 flex items-center gap-4 text-sm">
                                                                <span className="bg-[var(--secondary)] px-3 py-1 rounded-full">
                                                                    👥 {reservation.guests} guests
                                                                </span>
                                                            </div>
                                                            {reservation.notes && (
                                                                <p className="mt-2 text-sm text-[var(--muted)]">Note: {reservation.notes}</p>
                                                            )}
                                                        </div>

                                                        {reservation.status === 'pending' && (
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => updateStatus(reservation._id, 'confirmed')}
                                                                    className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                                                                >
                                                                    Confirm
                                                                </button>
                                                                <button
                                                                    onClick={() => updateStatus(reservation._id, 'cancelled')}
                                                                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card p-12 text-center">
                            <span className="text-6xl block mb-4">📅</span>
                            <h3 className="text-xl font-semibold mb-2">No reservations found</h3>
                            <p className="text-[var(--muted)]">
                                {filter !== 'all' ? `No ${filter} reservations` : 'Reservations will appear here'}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
