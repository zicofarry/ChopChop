'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminTestimonialsPage() {
    const router = useRouter();
    const { user, token, isAdmin, loading: authLoading } = useAuth();
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');

    useEffect(() => {
        if (!authLoading) {
            if (!user) router.push('/auth/login');
            else if (!isAdmin) router.push('/dashboard');
            else fetchTestimonials();
        }
    }, [user, isAdmin, authLoading]);

    const fetchTestimonials = async () => {
        try {
            const res = await fetch(`${API_URL}/testimonials/all`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) setTestimonials(data);
        } catch (error) {
            console.error('Failed to fetch testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateApproval = async (id, approved) => {
        try {
            await fetch(`${API_URL}/testimonials/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ approved })
            });
            fetchTestimonials();
        } catch (error) {
            console.error('Failed to update testimonial:', error);
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <span key={i} className={i < rating ? 'text-[var(--accent)]' : 'text-[var(--border)]'}>
                ★
            </span>
        ));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const filteredTestimonials = testimonials.filter(t => {
        if (filter === 'pending') return !t.approved;
        if (filter === 'approved') return t.approved;
        return true;
    });

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
                    <h1 className="text-3xl font-bold">Testimonial Management</h1>
                </div>
            </section>

            {/* Filter */}
            <section className="py-4 border-b border-[var(--border)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--secondary)]'
                                }`}
                        >
                            All ({testimonials.length})
                        </button>
                        <button
                            onClick={() => setFilter('pending')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'pending' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--secondary)]'
                                }`}
                        >
                            Pending ({testimonials.filter(t => !t.approved).length})
                        </button>
                        <button
                            onClick={() => setFilter('approved')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'approved' ? 'bg-[var(--primary)] text-white' : 'bg-[var(--secondary)]'
                                }`}
                        >
                            Approved ({testimonials.filter(t => t.approved).length})
                        </button>
                    </div>
                </div>
            </section>

            {/* Testimonials List */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="card p-6 animate-pulse">
                                    <div className="h-4 bg-[var(--secondary)] rounded w-1/4 mb-4" />
                                    <div className="h-20 bg-[var(--secondary)] rounded mb-4" />
                                    <div className="h-4 bg-[var(--secondary)] rounded w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : filteredTestimonials.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {filteredTestimonials.map((testimonial) => (
                                <div
                                    key={testimonial._id}
                                    className={`card p-6 ${!testimonial.approved ? 'border-2 border-yellow-400/50' : ''}`}
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-bold">
                                                {testimonial.user?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-medium">{testimonial.user?.name || 'Unknown'}</p>
                                                <p className="text-sm text-[var(--muted)]">{testimonial.user?.email}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${testimonial.approved
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            }`}>
                                            {testimonial.approved ? 'Approved' : 'Pending'}
                                        </span>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex space-x-1 text-xl mb-3">
                                        {renderStars(testimonial.rating)}
                                    </div>

                                    {/* Content */}
                                    <p className="text-[var(--foreground)] mb-4">
                                        "{testimonial.content}"
                                    </p>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                                        <span className="text-sm text-[var(--muted)]">
                                            {formatDate(testimonial.createdAt)}
                                        </span>
                                        <div className="flex gap-2">
                                            {!testimonial.approved ? (
                                                <button
                                                    onClick={() => updateApproval(testimonial._id, true)}
                                                    className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600"
                                                >
                                                    Approve
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => updateApproval(testimonial._id, false)}
                                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
                                                >
                                                    Unapprove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card p-12 text-center">
                            <svg className="w-16 h-16 mx-auto mb-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                            <h3 className="text-xl font-semibold mb-2">No testimonials found</h3>
                            <p className="text-[var(--muted)]">
                                {filter === 'pending' ? 'No pending testimonials' : 'Testimonials will appear here'}
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
