import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background with gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--secondary)] via-[var(--background)] to-[var(--secondary-dark)]" />

            {/* Decorative elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--primary)]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl" />

            {/* Coffee bean decorations */}
            <div className="absolute top-1/4 right-1/4 text-6xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>
                ☕
            </div>
            <div className="absolute bottom-1/3 left-1/5 text-4xl opacity-15 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                ☕
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="animate-fadeIn">
                    {/* Badge */}
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/20 mb-8">
                        <span className="text-sm font-medium text-[var(--primary)]">
                            ✨ Premium Coffee Experience
                        </span>
                    </div>

                    {/* Main heading */}
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">
                        <span className="text-[var(--foreground)]">Where Every Cup</span>
                        <br />
                        <span className="gradient-text">Tells a Story</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-[var(--muted)] max-w-2xl mx-auto mb-10">
                        Experience the perfect blend of tradition and innovation.
                        Our carefully crafted coffee awaits you.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/menu" className="btn-primary text-lg px-8 py-4">
                            Explore Menu
                        </Link>
                        <Link href="/reservation" className="btn-secondary text-lg px-8 py-4">
                            Book a Table
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold gradient-text">50+</div>
                            <div className="text-[var(--muted)] text-sm mt-1">Coffee Varieties</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold gradient-text">10K+</div>
                            <div className="text-[var(--muted)] text-sm mt-1">Happy Customers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold gradient-text">5★</div>
                            <div className="text-[var(--muted)] text-sm mt-1">Rating</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <svg className="w-6 h-6 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
}
