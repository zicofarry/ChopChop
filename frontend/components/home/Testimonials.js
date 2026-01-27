'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getTestimonials } from '@/lib/api';

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const data = await getTestimonials();
            if (Array.isArray(data)) {
                setTestimonials(data.slice(0, 3));
            }
        } catch (error) {
            console.error('Failed to fetch testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    // Placeholder testimonials with real photos
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

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <span key={i} className={i < rating ? 'text-[var(--accent)]' : 'text-[var(--border)]'}>
                ★
            </span>
        ));
    };

    return (
        <section className="py-20 bg-[var(--secondary)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <span className="text-[var(--accent)] font-medium text-sm uppercase tracking-wider">
                        Testimonials
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
                        <span className="gradient-text">What Our Customers Say</span>
                    </h2>
                    <p className="text-[var(--muted)] max-w-2xl mx-auto">
                        Don't just take our word for it. Here's what our valued customers have to say about their ChopChop experience.
                    </p>
                </div>

                {/* Testimonials Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="card p-8 animate-pulse">
                                <div className="flex space-x-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <div key={s} className="h-5 w-5 bg-[var(--border)] rounded" />
                                    ))}
                                </div>
                                <div className="h-24 bg-[var(--border)] rounded mb-6" />
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-[var(--border)] rounded-full mr-4" />
                                    <div className="h-4 bg-[var(--border)] rounded w-24" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
                        {displayTestimonials.map((testimonial, index) => (
                            <div key={testimonial._id} className="card p-8 hover:-translate-y-2">
                                {/* Stars */}
                                <div className="flex space-x-1 text-xl mb-4">
                                    {renderStars(testimonial.rating)}
                                </div>

                                {/* Quote */}
                                <p className="text-[var(--foreground)] mb-6 leading-relaxed">
                                    "{testimonial.content}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                        {testimonial.image || placeholderTestimonials[index]?.image ? (
                                            <Image
                                                src={testimonial.image || placeholderTestimonials[index]?.image}
                                                alt={testimonial.user?.name || 'Customer'}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] flex items-center justify-center text-white font-bold text-lg">
                                                {testimonial.user?.name?.charAt(0) || 'U'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <div className="font-semibold text-[var(--foreground)]">
                                            {testimonial.user?.name || 'Happy Customer'}
                                        </div>
                                        <div className="text-sm text-[var(--muted)]">Verified Customer</div>
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
