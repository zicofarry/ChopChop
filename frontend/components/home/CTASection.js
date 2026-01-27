import Link from 'next/link';

export default function CTASection() {
    return (
        <section className="py-20 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-10 left-10 text-8xl">☕</div>
                <div className="absolute bottom-10 right-10 text-8xl">☕</div>
                <div className="absolute top-1/2 left-1/3 text-6xl">☕</div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Ready for Your Perfect Cup?
                </h2>
                <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                    Visit us today and experience the ChopChop difference.
                    Whether you're grabbing a quick coffee or settling in for a work session,
                    we've got you covered.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/reservation"
                        className="bg-white text-[var(--primary)] px-8 py-4 rounded-lg font-semibold 
                       hover:bg-[var(--secondary)] transition-all hover:scale-105 hover:shadow-lg"
                    >
                        Reserve a Table
                    </Link>
                    <Link
                        href="/menu"
                        className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold 
                       hover:bg-white hover:text-[var(--primary)] transition-all"
                    >
                        View Menu
                    </Link>
                </div>

                {/* Opening Hours */}
                <div className="mt-12 inline-flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                    <span className="text-white/80">🕐</span>
                    <span className="text-white">Open Daily: 08:00 - 22:00</span>
                </div>
            </div>
        </section>
    );
}
