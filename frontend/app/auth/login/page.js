'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { login as loginApi } from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await loginApi(formData.email, formData.password);

            if (response.token) {
                login(response, response.token);
                router.push(response.role === 'admin' ? '/admin' : '/dashboard');
            } else {
                setError(response.message || 'Invalid email or password');
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
                    <h1 className="text-2xl font-bold mt-6">Welcome Back</h1>
                    <p className="text-[var(--muted)] mt-2">Sign in to continue to your account</p>
                </div>

                {/* Form */}
                <div className="card p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
                            ❌ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
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

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-[var(--muted)]">
                            Don't have an account?{' '}
                            <Link href="/auth/register" className="text-[var(--primary)] hover:underline font-medium">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Demo credentials */}
                <div className="mt-6 p-4 rounded-lg bg-[var(--secondary)] text-center">
                    <p className="text-sm text-[var(--muted)]">
                        Demo: Create an account to get started!
                    </p>
                </div>
            </div>
        </div>
    );
}
