'use client';

import { useState } from 'react';
import Link from 'next/link';
import TableSelector from './TableSelector';

export default function Hero() {
    const [showTables, setShowTables] = useState(false);

    return (
        <>
            <section className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center bg-secondary overflow-hidden">
                {/* Subtle animated background elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-accent/10 blur-[100px] animate-[pulse_8s_ease-in-out_infinite]" />
                    <div className="absolute top-[40%] -right-[20%] w-[50%] h-[70%] rounded-full bg-primary/5 blur-[120px] animate-[pulse_10s_ease-in-out_infinite_alternate]" />
                </div>
                
                {/* Optional grid pattern overlay for texture */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02] pointer-events-none"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
                            Where Every Cup
                            <br />
                            <span className="text-accent relative inline-block group cursor-default">
                                Tells a Story
                                {/* Interactive underline */}
                                <span className="absolute -bottom-1 left-0 w-full h-1 bg-accent/40 rounded-full origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
                            </span>
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
                                    hover:bg-primary-dark transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
                            >
                                Order Now
                            </button>
                            <Link
                                href="/menu"
                                className="w-full sm:w-auto border border-border bg-background/50 backdrop-blur-sm
                                    text-foreground px-6 sm:px-8 py-3.5 sm:py-4
                                    rounded-xl font-medium text-sm sm:text-base
                                    hover:bg-background hover:border-foreground/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm active:scale-[0.98]"
                            >
                                View Menu
                            </Link>
                        </div>
                    </div>

                    <div className="mt-16 md:mt-20 grid grid-cols-3 gap-8 max-w-md mx-auto">
                        <div className="text-center group cursor-default">
                            <div className="text-2xl md:text-3xl font-bold text-foreground transition-transform duration-300 group-hover:scale-110">50+</div>
                            <div className="text-muted text-xs sm:text-sm mt-1 transition-colors group-hover:text-foreground">Coffee Varieties</div>
                        </div>
                        <div className="text-center group cursor-default">
                            <div className="text-2xl md:text-3xl font-bold text-foreground transition-transform duration-300 group-hover:scale-110">10K+</div>
                            <div className="text-muted text-xs sm:text-sm mt-1 transition-colors group-hover:text-foreground">Happy Customers</div>
                        </div>
                        <div className="text-center group cursor-default">
                            <div className="text-2xl md:text-3xl font-bold text-foreground transition-transform duration-300 group-hover:scale-110">5.0</div>
                            <div className="text-muted text-xs sm:text-sm mt-1 transition-colors group-hover:text-foreground">Rating</div>
                        </div>
                    </div>
                </div>
            </section>

            {showTables && <TableSelector onClose={() => setShowTables(false)} />}
        </>
    );
}
