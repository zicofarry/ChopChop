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
        { icon: '📍', label: 'Address', value: 'Jl. Kopi Nikmat No. 123, Jakarta 12345' },
        { icon: '📞', label: 'Phone', value: '+62 812 3456 7890' },
        { icon: '✉️', label: 'Email', value: 'hello@chopchop.coffee' },
        { icon: '🕐', label: 'Hours', value: 'Daily 08:00 - 22:00' },
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
                                    ✅ Thank you! Your message has been sent successfully.
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
                                            <span className="text-2xl">{info.icon}</span>
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
                                    <span className="text-6xl block mb-4">📍</span>
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
