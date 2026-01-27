'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { isDark, toggleTheme } = useTheme();
    const { user, logout, isAdmin } = useAuth();
    const { totalItems, openCart } = useCart();

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Menu', href: '/menu' },
        { name: 'Reservation', href: '/reservation' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="/images/espresso.png"
                            alt="ChopChop Coffee"
                            width={40}
                            height={40}
                            className="rounded-full bg-white object-contain p-0.5"
                            priority
                        />
                        <span className="text-2xl font-bold gradient-text">ChopChop</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors font-medium"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right side buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Cart Button */}
                        <button
                            onClick={openCart}
                            className="relative p-2 rounded-full hover:bg-[var(--secondary)] transition-colors"
                            aria-label="Open cart"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[var(--primary)] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                                    {totalItems > 9 ? '9+' : totalItems}
                                </span>
                            )}
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-[var(--secondary)] transition-colors"
                            aria-label="Toggle theme"
                        >
                            {isDark ? (
                                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 text-[var(--primary)]" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            )}
                        </button>

                        {/* Auth buttons */}
                        {user ? (
                            <div className="flex items-center space-x-4">
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="text-[var(--accent)] hover:text-[var(--accent-dark)] font-medium"
                                    >
                                        Admin
                                    </Link>
                                )}
                                <Link
                                    href="/dashboard"
                                    className="text-[var(--foreground)] hover:text-[var(--primary)] font-medium"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={logout}
                                    className="btn-secondary text-sm px-4 py-2"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link
                                    href="/auth/login"
                                    className="text-[var(--foreground)] hover:text-[var(--primary)] font-medium"
                                >
                                    Login
                                </Link>
                                <Link href="/auth/register" className="btn-primary text-sm px-4 py-2">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center space-x-2">
                        {/* Mobile Cart */}
                        <button
                            onClick={openCart}
                            className="relative p-2 rounded-full hover:bg-[var(--secondary)]"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[var(--primary)] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                                    {totalItems > 9 ? '9+' : totalItems}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-[var(--secondary)]"
                        >
                            {isDark ? '☀️' : '🌙'}
                        </button>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg hover:bg-[var(--secondary)]"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t border-[var(--border)] animate-fadeIn">
                        <div className="flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-[var(--foreground)] hover:text-[var(--primary)] font-medium py-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <hr className="border-[var(--border)]" />
                            {user ? (
                                <>
                                    {isAdmin && (
                                        <Link href="/admin" className="text-[var(--accent)] font-medium py-2">
                                            Admin Panel
                                        </Link>
                                    )}
                                    <Link href="/dashboard" className="font-medium py-2">
                                        Dashboard
                                    </Link>
                                    <button onClick={logout} className="btn-secondary w-full">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/login" className="font-medium py-2">
                                        Login
                                    </Link>
                                    <Link href="/auth/register" className="btn-primary text-center">
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
