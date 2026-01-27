'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createReservation } from '@/lib/api';
import Link from 'next/link';

export default function ReservationPage() {
    const { user, token } = useAuth();
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        guests: 2,
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const timeSlots = [
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
        '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError('');

        try {
            const response = await createReservation(formData, token);
            if (response._id) {
                setSuccess(true);
                setFormData({ date: '', time: '', guests: 2, notes: '' });
            } else {
                setError(response.message || 'Failed to create reservation');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Get min date (today)
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="py-20 bg-gradient-to-br from-[var(--secondary)] to-[var(--background)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-[var(--accent)] font-medium text-sm uppercase tracking-wider">
                        Book Your Visit
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
                        <span className="gradient-text">Make a Reservation</span>
                    </h1>
                    <p className="text-[var(--muted)] max-w-2xl mx-auto">
                        Reserve your table and enjoy a premium coffee experience in our cozy space.
                    </p>
                </div>
            </section>

            {/* Reservation Form */}
            <section className="py-20 bg-[var(--background)]">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    {!user ? (
                        <div className="card p-12 text-center">
                            <span className="text-6xl block mb-6">🔐</span>
                            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
                            <p className="text-[var(--muted)] mb-8">
                                Please login or create an account to make a reservation.
                            </p>
                            <div className="flex justify-center gap-4">
                                <Link href="/auth/login" className="btn-primary">
                                    Login
                                </Link>
                                <Link href="/auth/register" className="btn-secondary">
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    ) : success ? (
                        <div className="card p-12 text-center">
                            <span className="text-6xl block mb-6">✅</span>
                            <h2 className="text-2xl font-bold mb-4">Reservation Confirmed!</h2>
                            <p className="text-[var(--muted)] mb-8">
                                Thank you for your reservation. We'll send a confirmation to your email shortly.
                            </p>
                            <button
                                onClick={() => setSuccess(false)}
                                className="btn-secondary"
                            >
                                Make Another Reservation
                            </button>
                        </div>
                    ) : (
                        <div className="card p-8">
                            <h2 className="text-2xl font-bold mb-6">Book Your Table</h2>

                            {error && (
                                <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
                                    ❌ {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Date */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Date</label>
                                        <input
                                            type="date"
                                            required
                                            min={today}
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] 
                               focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                                        />
                                    </div>

                                    {/* Time */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Time</label>
                                        <select
                                            required
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] 
                               focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                                        >
                                            <option value="">Select time</option>
                                            {timeSlots.map((time) => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Guests */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Number of Guests</label>
                                    <div className="flex items-center space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, guests: Math.max(1, formData.guests - 1) })}
                                            className="w-12 h-12 rounded-lg bg-[var(--secondary)] hover:bg-[var(--primary)] 
                               hover:text-white transition-all font-bold text-xl"
                                        >
                                            -
                                        </button>
                                        <span className="text-2xl font-bold w-12 text-center">{formData.guests}</span>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, guests: Math.min(20, formData.guests + 1) })}
                                            className="w-12 h-12 rounded-lg bg-[var(--secondary)] hover:bg-[var(--primary)] 
                               hover:text-white transition-all font-bold text-xl"
                                        >
                                            +
                                        </button>
                                        <span className="text-[var(--muted)] ml-4">guests</span>
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Special Requests (Optional)</label>
                                    <textarea
                                        rows={3}
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] 
                             focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all resize-none"
                                        placeholder="Any dietary requirements, celebrations, etc."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Processing...' : 'Confirm Reservation'}
                                </button>
                            </form>

                            {/* Info */}
                            <div className="mt-8 p-4 rounded-lg bg-[var(--secondary)]">
                                <h4 className="font-medium mb-2">📌 Please Note:</h4>
                                <ul className="text-sm text-[var(--muted)] space-y-1">
                                    <li>• Reservations are held for 15 minutes past the scheduled time</li>
                                    <li>• For groups larger than 10, please call us directly</li>
                                    <li>• You'll receive a confirmation email shortly after booking</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
