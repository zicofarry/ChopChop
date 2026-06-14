'use client';

import { useState } from 'react';
import Link from 'next/link';
import TableSelector from './TableSelector';

export default function CTASection() {
    const [showTables, setShowTables] = useState(false);

    return (
        <>
            <section className="py-16 sm:py-20 bg-[var(--secondary)]">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
                        Ready for Your Perfect Cup?
                    </h2>
                    <p className="text-[var(--muted)] text-sm sm:text-base mb-8 max-w-lg mx-auto leading-relaxed">
                        Whether you are grabbing a quick coffee or settling in for a work session,
                        we have got you covered.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                        <button
                            onClick={() => setShowTables(true)}
                            className="w-full sm:w-auto bg-[var(--primary)] text-white px-6 sm:px-8 py-3.5 
                                rounded-xl font-medium text-sm hover:bg-[var(--primary-dark)] transition-all active:scale-[0.98]"
                        >
                            Order Now
                        </button>
                        <Link
                            href="/menu"
                            className="w-full sm:w-auto border-2 border-[var(--primary)] text-[var(--primary)] px-6 sm:px-8 py-3.5 
                                rounded-xl font-medium text-sm hover:bg-[var(--primary)] hover:text-white transition-all"
                        >
                            View Menu
                        </Link>
                    </div>

                    <div className="mt-8 inline-flex items-center gap-2 bg-[var(--primary)]/10 rounded-full px-5 py-2.5">
                        <svg className="w-4 h-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[var(--muted)] text-sm">Open Daily: 08:00 - 22:00</span>
                    </div>
                </div>
            </section>

            {showTables && <TableSelector onClose={() => setShowTables(false)} />}
        </>
    );
}
