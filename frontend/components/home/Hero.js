'use client';

import { useState } from 'react';
import Link from 'next/link';
import TableSelector from './TableSelector';

export default function Hero() {
    const [showTables, setShowTables] = useState(false);

    return (
        <>
            <section className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center bg-secondary">
                <div className="absolute inset-0 bg-gradient-to-b from-secondary to-background" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
                            Where Every Cup
                            <br />
                            <span className="text-accent">Tells a Story</span>
                        </h1>

                        <p className="text-base sm:text-lg md:text-xl text-muted max-w-xl mx-auto mb-10 leading-relaxed">
                            Experience the perfect blend of tradition and innovation.
                            Our carefully crafted coffee awaits you.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                            <button
                                onClick={() => setShowTables(true)}
                                className="w-full sm:w-auto bg-primary text-white
                                    px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-medium text-sm sm:text-base
                                    hover:bg-primary-dark transition-all active:scale-[0.98]"
                            >
                                Order Now
                            </button>
                            <Link
                                href="/menu"
                                className="w-full sm:w-auto border border-border
                                    text-foreground px-6 sm:px-8 py-3.5 sm:py-4
                                    rounded-xl font-medium text-sm sm:text-base
                                    hover:bg-secondary transition-all"
                            >
                                View Menu
                            </Link>
                        </div>
                    </div>

                    <div className="mt-16 md:mt-20 grid grid-cols-3 gap-8 max-w-md mx-auto">
                        <div className="text-center">
                            <div className="text-2xl md:text-3xl font-bold text-foreground">50+</div>
                            <div className="text-muted text-xs sm:text-sm mt-1">Coffee Varieties</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl md:text-3xl font-bold text-foreground">10K+</div>
                            <div className="text-muted text-xs sm:text-sm mt-1">Happy Customers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl md:text-3xl font-bold text-foreground">5.0</div>
                            <div className="text-muted text-xs sm:text-sm mt-1">Rating</div>
                        </div>
                    </div>
                </div>
            </section>

            {showTables && <TableSelector onClose={() => setShowTables(false)} />}
        </>
    );
}
