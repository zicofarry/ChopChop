'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout, isAdmin } = useAuth();
    const { totalItems } = useCart();

    const publicLinks = [
        { name: 'Home', href: '/' },
        { name: 'Menu', href: '/menu' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    const adminLinks = [
        { name: 'Dashboard', href: '/admin' },
        { name: 'Menu', href: '/admin/menu' },
        { name: 'Orders', href: '/admin/orders' },
        { name: 'Tables', href: '/admin/tables' },
        { name: 'Testimonials', href: '/admin/testimonials' },
    ];

    const navLinks = isAdmin ? (
        <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-[var(--muted)] hover:text-[var(--primary)] transition-colors text-sm font-medium">
                Public Site
            </Link>
            <span className="text-[var(--border)]">|</span>
            {adminLinks.map((link) => (
                <Link
                    key={link.name}
                    href={link.href}
                    className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors font-medium"
                >
                    {link.name}
                </Link>
            ))}
        </div>
    ) : (
        <div className="hidden md:flex items-center space-x-8">
            {publicLinks.map((link) => (
                <Link
                    key={link.name}
                    href={link.href}
                    className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors font-medium"
                >
                    {link.name}
                </Link>
            ))}
        </div>
    );

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)] border-b border-[var(--border)] shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
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

                    {navLinks}

                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            href="/cart"
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
                        </Link>

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
                                <button
                                    onClick={logout}
                                    className="btn-secondary text-sm px-4 py-2"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="text-[var(--foreground)] hover:text-[var(--primary)] font-medium"
                            >
                                Admin Login
                            </Link>
                        )}
                    </div>

                    <div className="md:hidden flex items-center space-x-2">
                        <Link
                            href="/cart"
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
                        </Link>
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

                {isOpen && (
                    <div className="md:hidden py-4 border-t border-[var(--border)] animate-fadeIn">
                        <div className="flex flex-col space-y-4">
                            {isAdmin ? (
                                <>
                                    <p className="text-xs text-[var(--muted)] uppercase tracking-wider font-semibold">Admin</p>
                                    {adminLinks.map((link) => (
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
                                    <Link
                                        href="/"
                                        className="text-[var(--muted)] text-sm py-2"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        ← Public Site
                                    </Link>
                                </>
                            ) : (
                                publicLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-[var(--foreground)] hover:text-[var(--primary)] font-medium py-2"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))
                            )}
                            <hr className="border-[var(--border)]" />
                            {user ? (
                                <button onClick={logout} className="btn-secondary w-full">
                                    Logout
                                </button>
                            ) : (
                                <Link href="/auth/login" className="font-medium py-2" onClick={() => setIsOpen(false)}>
                                    Admin Login
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
