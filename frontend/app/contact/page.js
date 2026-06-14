'use client';

import { useState } from 'react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // In real app, send to API
        console.log('Form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    const contactInfo = [
        { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z', label: 'Address', value: 'Jl. Kopi Nikmat No. 123, Jakarta 12345' },
        { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', label: 'Phone', value: '+62 812 3456 7890' },
        { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: 'Email', value: 'hello@chopchop.coffee' },
        { icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Hours', value: 'Daily 08:00 - 22:00' },
    ];

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="py-20 bg-gradient-to-br from-[var(--secondary)] to-[var(--background)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="text-[var(--accent)] font-medium text-sm uppercase tracking-wider">
                        Get in Touch
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
                        <span className="gradient-text">Contact Us</span>
                    </h1>
                    <p className="text-[var(--muted)] max-w-2xl mx-auto">
                        Have a question, feedback, or just want to say hi?
                        We'd love to hear from you.
                    </p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 bg-[var(--background)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="card p-8">
                            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

                            {submitted && (
                                <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">
                                    Thank you! Your message has been sent successfully.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] 
                               focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                                            placeholder="Your name"
                                        />
                                    </div>
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
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] 
                             focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                                        placeholder="How can we help?"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Message</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] 
                             focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all resize-none"
                                        placeholder="Your message..."
                                    />
                                </div>
                                <button type="submit" className="btn-primary w-full">
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-6">Visit Us</h2>
                                <div className="space-y-4">
                                    {contactInfo.map((info, index) => (
                                        <div key={index} className="flex items-start space-x-4 p-4 rounded-xl bg-[var(--secondary)]">
                                            <svg className="w-6 h-6 text-[var(--primary)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={info.icon} /></svg>
                                            <div>
                                                <div className="font-medium">{info.label}</div>
                                                <div className="text-[var(--muted)]">{info.value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <div className="rounded-2xl overflow-hidden h-80 bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10 flex items-center justify-center">
                                <div className="text-center">
                                    <svg className="w-16 h-16 mx-auto mb-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    <p className="text-[var(--muted)]">Interactive map coming soon</p>
                                </div>
                            </div>

                            {/* Social Media */}
                            <div>
                                <h3 className="font-semibold mb-4">Follow Us</h3>
                                <div className="flex space-x-4">
                                    {['Instagram', 'Twitter', 'Facebook'].map((social) => (
                                        <a
                                            key={social}
                                            href="#"
                                            className="px-4 py-2 rounded-lg bg-[var(--secondary)] hover:bg-[var(--primary)] 
                               hover:text-white transition-all text-sm font-medium"
                                        >
                                            {social}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
