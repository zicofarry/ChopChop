'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getCafeTables, createTable, deleteTable } from '@/lib/api';
import QRCode from 'qrcode';

function TableQR({ table }) {
    const canvasRef = useRef(null);
    const [qrDataUrl, setQrDataUrl] = useState(null);

    useEffect(() => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
        const url = `${baseUrl}/order/${table.qrCodeToken}`;

        QRCode.toDataURL(url, {
            width: 200,
            margin: 2,
            color: { dark: '#1a1a2e', light: '#ffffff' }
        }).then(dataUrl => {
            setQrDataUrl(dataUrl);
        });

        if (canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, url, {
                width: 200,
                margin: 2,
                color: { dark: '#1a1a2e', light: '#ffffff' }
            });
        }
    }, [table.qrCodeToken]);

    const handleDownload = () => {
        if (!qrDataUrl) return;
        const link = document.createElement('a');
        link.download = `meja-${table.tableNumber}-chopchop.png`;
        link.href = qrDataUrl;
        link.click();
    };

    return (
        <div className="text-center">
            <canvas ref={canvasRef} className="hidden" />
            {qrDataUrl && (
                <img src={qrDataUrl} alt={`QR Meja ${table.tableNumber}`} className="mx-auto w-40 h-40" />
            )}
            <div className="mt-3 space-y-2">
                <button
                    onClick={handleDownload}
                    className="text-sm bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                    Download QR
                </button>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(
                            `${window.location.origin}/order/${table.qrCodeToken}`
                        );
                        alert('URL copied!');
                    }}
                    className="text-sm text-[var(--primary)] hover:underline block w-full"
                >
                    Copy URL
                </button>
            </div>
        </div>
    );
}

export default function AdminTablesPage() {
    const router = useRouter();
    const { user, token, isAdmin, loading: authLoading } = useAuth();
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [tableNumber, setTableNumber] = useState('');
    const [selectedTable, setSelectedTable] = useState(null);

    useEffect(() => {
        if (!authLoading) {
            if (!user) router.push('/auth/login');
            else if (!isAdmin) router.push('/dashboard');
            else fetchTables();
        }
    }, [user, isAdmin, authLoading]);

    const fetchTables = async () => {
        try {
            const data = await getCafeTables(token);
            if (Array.isArray(data)) setTables(data);
        } catch (error) {
            console.error('Failed to fetch tables:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createTable({ tableNumber: Number(tableNumber) }, token);
            setShowModal(false);
            setTableNumber('');
            fetchTables();
        } catch (error) {
            console.error('Failed to create table:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Hapus meja ini?')) return;
        try {
            await deleteTable(id, token);
            setSelectedTable(null);
            fetchTables();
        } catch (error) {
            console.error('Failed to delete table:', error);
        }
    };

    if (authLoading || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary)]"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <section className="py-8 bg-gradient-to-br from-[var(--secondary)] to-[var(--background)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link href="/admin" className="text-[var(--primary)] text-sm hover:underline mb-2 block">
                                ← Back to Dashboard
                            </Link>
                            <h1 className="text-3xl font-bold">Table Management</h1>
                            <p className="text-[var(--muted)] mt-1">Generate & download QR codes for each table</p>
                        </div>
                        <button onClick={() => setShowModal(true)} className="btn-primary">
                            + Add Table
                        </button>
                    </div>
                </div>
            </section>

            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="card p-6 animate-pulse">
                                    <div className="h-40 bg-[var(--secondary)] rounded mb-4" />
                                    <div className="h-4 bg-[var(--secondary)] rounded w-1/2 mx-auto" />
                                </div>
                            ))}
                        </div>
                    ) : tables.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {tables.map((table) => (
                                <div
                                    key={table._id}
                                    className={`card p-6 cursor-pointer transition-all ${selectedTable?._id === table._id ? 'ring-2 ring-[var(--primary)]' : 'hover:-translate-y-1'
                                        }`}
                                    onClick={() => setSelectedTable(selectedTable?._id === table._id ? null : table)}
                                >
                                    <div className="text-center mb-3">
                                        <svg className="w-8 h-8 mx-auto text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <h3 className="text-xl font-bold mt-1">Meja {table.tableNumber}</h3>
                                        <p className={`text-xs ${table.isActive ? 'text-green-600' : 'text-red-500'}`}>
                                            {table.isActive ? 'Active' : 'Inactive'}
                                        </p>
                                    </div>

                                    {selectedTable?._id === table._id && (
                                        <>
                                            <div className="border-t border-[var(--border)] pt-4 mt-2">
                                                <TableQR table={table} />
                                            </div>
                                            <div className="mt-3 flex gap-2 justify-center">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(table._id); }}
                                                    className="text-xs text-red-500 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card p-12 text-center">
                            <svg className="w-16 h-16 mx-auto mb-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 8h16M4 8v8m0-8V4h16v4M4 16h16v4H4z" /></svg>
                            <h3 className="text-xl font-semibold mb-2">No tables yet</h3>
                            <p className="text-[var(--muted)]">Add your first table to generate QR codes</p>
                        </div>
                    )}
                </div>
            </section>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="card p-8 max-w-md w-full">
                        <h2 className="text-2xl font-bold mb-6">Add New Table</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Table Number</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={tableNumber}
                                    onChange={(e) => setTableNumber(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                                />
                            </div>
                            <div className="flex gap-4 pt-2">
                                <button type="submit" className="btn-primary flex-1">Create</button>
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
