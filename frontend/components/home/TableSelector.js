'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPublicTables } from '@/lib/api';

export default function TableSelector({ onClose }) {
    const router = useRouter();
    const [tables, setTables] = useState([]);
    const [cafe, setCafe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                const data = await getPublicTables('chopchop');
                if (data.tables) {
                    setTables(data.tables);
                    setCafe(data.cafe);
                }
            } catch (err) {
                console.error('Failed to load tables:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTables();
    }, []);

    const selectTable = (table) => {
        router.push(`/order/${table.qrCodeToken}`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="relative w-full md:max-w-lg bg-card-bg rounded-t-2xl md:rounded-2xl max-h-[85vh] overflow-auto">
                <div className="sticky top-0 bg-card-bg border-b border-border px-6 py-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">
                            Pilih Meja
                        </h2>
                        <p className="text-sm text-muted">
                            {cafe?.name || 'ChopChop Coffee'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary transition-colors"
                    >
                        <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="grid grid-cols-5 gap-3">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="aspect-square rounded-xl bg-secondary animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-muted mb-4">
                                Silakan pilih meja Anda untuk mulai memesan
                            </p>
                            <div className="grid grid-cols-5 gap-3">
                                {tables.map((table) => (
                                    <button
                                        key={table._id}
                                        onClick={() => selectTable(table)}
                                        className="aspect-square rounded-xl border border-border 
                                            hover:border-primary
                                            hover:bg-secondary
                                            transition-all active:scale-95 flex items-center justify-center"
                                    >
                                        <span className="text-sm font-medium text-foreground">
                                            {table.tableNumber}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
