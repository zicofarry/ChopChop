'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { register as registerApi } from '@/lib/api';

export default function RegisterPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await registerApi({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            });

            if (response.token) {
                login(response, response.token);
                router.push('/dashboard');
            } else {
                setError(response.message || 'Registration failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-[var(--background)]">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center space-x-2">
                        <span className="text-4xl">☕</span>
                        <span className="text-3xl font-bold gradient-text">ChopChop</span>
                    </Link>
                    <h1 className="text-2xl font-bold mt-6">Create Account</h1>
                    <p className="text-[var(--muted)] mt-2">Join us and enjoy exclusive benefits</p>
                </div>

                {/* Form */}
                <div className="card p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
                            ❌ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium mb-2">Full Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] 
                         focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] 
                         focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Phone Number</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] 
                         focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                                placeholder="+62 812 3456 7890"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Password</label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] 
                         focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] 
                         focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-[var(--muted)]">
                            Already have an account?{' '}
                            <Link href="/auth/login" className="text-[var(--primary)] hover:underline font-medium">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Terms */}
                <p className="mt-6 text-center text-sm text-[var(--muted)]">
                    By creating an account, you agree to our{' '}
                    <a href="#" className="text-[var(--primary)] hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-[var(--primary)] hover:underline">Privacy Policy</a>
                </p>
            </div>
        </div>
    );
}
