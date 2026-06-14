'use client';

import { useState, useEffect } from 'react';
import { getTestimonials } from '@/lib/api';

function StarRating({ rating }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <svg
                    key={i}
                    className={`w-4 h-4 ${i < rating ? 'text-accent' : 'text-border'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const data = await getTestimonials();
            if (Array.isArray(data)) setTestimonials(data.slice(0, 3));
        } catch (error) {
            console.error('Failed to fetch testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    const placeholderTestimonials = [
        {
            _id: '1',
            user: { name: 'Sarah Johnson' },
            image: '/images/reviewer_sarah.png',
            content: 'The best coffee I\'ve ever had! The atmosphere is so cozy and the staff is incredibly friendly. ChopChop has become my daily ritual.',
            rating: 5,
        },
        {
            _id: '2',
            user: { name: 'Michael Chen' },
            image: '/images/reviewer_michael.png',
            content: 'Perfect spot for remote work. Great WiFi, comfortable seating, and their signature latte keeps me energized throughout the day.',
            rating: 5,
        },
        {
            _id: '3',
            user: { name: 'Emily Williams' },
            image: '/images/reviewer_emily.png',
            content: 'Love the attention to detail in every cup. You can taste the quality and passion in their coffee. Highly recommend the cold brew!',
            rating: 5,
        },
    ];

    const displayTestimonials = testimonials.length > 0 ? testimonials : placeholderTestimonials;

    return (
        <section className="py-16 sm:py-20 bg-secondary relative overflow-hidden">
            {/* Subtle animated background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[50%] h-[100%] rounded-full bg-accent/5 blur-[120px] animate-[pulse_15s_ease-in-out_infinite]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-10 sm:mb-14">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 transition-transform hover:scale-105 duration-300 inline-block">
                        What Our Customers Say
                    </h2>
                    <p className="text-muted text-sm sm:text-base max-w-xl mx-auto">
                        Don&apos;t just take our word for it
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-card-bg rounded-xl p-6 animate-pulse">
                                <div className="h-4 w-20 bg-secondary-dark rounded mb-4" />
                                <div className="h-20 bg-secondary-dark rounded mb-4" />
                                <div className="h-4 w-24 bg-secondary-dark rounded" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {displayTestimonials.map((testimonial) => (
                            <div
                                key={testimonial._id}
                                className="bg-card-bg rounded-xl p-6 md:p-8 border border-border hover:shadow-lg hover:border-accent/30 hover:-translate-y-1.5 transition-all duration-300 group flex flex-col h-full"
                            >
                                <StarRating rating={testimonial.rating} />

                                <p className="text-foreground/90 text-[15px] sm:text-base leading-relaxed mt-5 mb-8 flex-grow">
                                    "{testimonial.content}"
                                </p>

                                <div className="flex items-center gap-4 mt-auto">
                                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-secondary">
                                        <img 
                                            src={testimonial.image || `https://i.pravatar.cc/150?u=${encodeURIComponent(testimonial.user?.name || testimonial._id)}`} 
                                            alt={testimonial.user?.name || 'Customer'}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-foreground text-base sm:text-lg">
                                            {testimonial.user?.name || 'Happy Customer'}
                                        </span>
                                        <span className="text-muted text-sm">Verified Customer</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
