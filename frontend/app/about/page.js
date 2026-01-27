import Image from 'next/image';

export default function AboutPage() {
    const team = [
        {
            name: 'Alex Thompson',
            role: 'Founder & Head Barista',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop'
        },
        {
            name: 'Maria Santos',
            role: 'Coffee Specialist',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop'
        },
        {
            name: 'David Lee',
            role: 'Pastry Chef',
            image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=400&auto=format&fit=crop'
        },
    ];

    const values = [
        {
            icon: '🌱',
            title: 'Quality First',
            description: 'We source only the finest, ethically-sourced coffee beans from around the world.'
        },
        {
            icon: '💚',
            title: 'Sustainability',
            description: 'Committed to eco-friendly practices, from biodegradable cups to responsible sourcing.'
        },
        {
            icon: '🤝',
            title: 'Community',
            description: 'More than a coffee shop - we\'re a gathering place for connection and creativity.'
        },
        {
            icon: '✨',
            title: 'Craftsmanship',
            description: 'Every cup is crafted with passion, precision, and attention to detail.'
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-br from-[var(--secondary)] to-[var(--background)] relative overflow-hidden">
                <div className="absolute top-1/4 right-10 text-8xl opacity-10 font-[var(--font-display)]">Coffee</div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl">
                        <span className="text-[var(--accent)] font-medium text-sm uppercase tracking-wider">
                            Our Story
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">
                            <span className="gradient-text">About ChopChop</span>
                        </h1>
                        <p className="text-xl text-[var(--muted)] leading-relaxed">
                            Born from a passion for exceptional coffee and meaningful connections,
                            ChopChop was founded in 2020 with a simple mission: to create a space
                            where every cup tells a story and every visit feels like coming home.
                        </p>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-20 bg-[var(--background)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Our Journey</h2>
                            <div className="space-y-4 text-[var(--muted)]">
                                <p>
                                    What started as a small kiosk has grown into a beloved destination
                                    for coffee enthusiasts and casual drinkers alike. Our founder, Alex,
                                    spent years traveling the world, learning from master roasters and
                                    baristas before bringing that knowledge home.
                                </p>
                                <p>
                                    "ChopChop" represents our commitment to doing things well and quickly -
                                    without compromising quality. It's about efficiency with excellence,
                                    speed with soul.
                                </p>
                                <p>
                                    Today, we continue to push boundaries, experimenting with new brewing
                                    techniques while honoring the traditions that make coffee such a
                                    timeless pleasure.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
                                <Image
                                    src="https://images.unsplash.com/photo-1542181961-9590d0c79dab?q=80&w=800&auto=format&fit=crop"
                                    alt="ChopChop Founders Team"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-[var(--accent)] text-white px-6 py-3 rounded-xl font-semibold shadow-lg">
                                Est. 2020
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-[var(--secondary)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            <span className="gradient-text">Our Values</span>
                        </h2>
                        <p className="text-[var(--muted)] mt-4 max-w-2xl mx-auto">
                            These core principles guide everything we do, from bean selection to customer service.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="card p-8 text-center hover:-translate-y-2">
                                <span className="text-5xl mb-4 block">{value.icon}</span>
                                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                                <p className="text-[var(--muted)] text-sm">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-[var(--background)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold">
                            <span className="gradient-text">Meet Our Team</span>
                        </h2>
                        <p className="text-[var(--muted)] mt-4">
                            The passionate people behind your perfect cup
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                        {team.map((member, index) => (
                            <div key={index} className="card p-8 text-center hover:-translate-y-2 group">
                                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-[var(--secondary)] shadow-lg group-hover:scale-105 transition-transform duration-300 relative">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                        sizes="128px"
                                    />
                                </div>
                                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                                <p className="text-[var(--primary)] text-sm font-medium">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
