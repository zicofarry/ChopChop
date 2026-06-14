'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { createGuestOrder, createOrder } from '@/lib/api';

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalPrice, clearCart, tableNumber, cafeId } = useCart();
    const { user, token } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [customerName, setCustomerName] = useState('');
    const [step, setStep] = useState('cart');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleCheckout = async () => {
        if (items.length === 0) return;
        setLoading(true);
        try {
            const orderPayload = {
                items: items.map((item) => ({
                    menu: item._id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                })),
                totalPrice,
                paymentMethod,
                customerName: customerName || undefined,
                tableNumber: tableNumber,
                cafe: cafeId || user?.cafe?._id,
            };

            let result;
            if (user) {
                result = await createOrder(orderPayload, token);
            } else {
                result = await createGuestOrder(orderPayload);
            }

            if (result.order) {
                setOrderSuccess(true);
                setOrderData(result.order);
                setStep('success');
                clearCart();

                if (paymentMethod === 'qris' && result.payment) {
                    setStep('qris');
                }
            } else {
                throw new Error(result.message || 'Order failed');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Gagal memesan: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (step === 'qris' && orderData) {
        return (
            <div className="min-h-screen bg-[var(--background)]">
                <div className="max-w-lg mx-auto px-4 py-12">
                    <div className="card p-8 text-center space-y-6">
                        <svg className="w-16 h-16 mx-auto text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
                        <h1 className="text-2xl font-bold">Bayar dengan QRIS</h1>
                        <p className="text-[var(--muted)]">Scan QR code di bawah untuk membayar</p>
                        <div className="w-48 h-48 mx-auto bg-white rounded-xl p-4 flex items-center justify-center">
                            <div className="relative w-full h-full">
                                <Image
                                    src="/images/qr-payment.png"
                                    alt="QRIS Payment"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-[var(--primary)]">
                            {formatPrice(orderData.totalPrice)}
                        </p>
                        <div className="space-y-2">
                            <p className="text-sm text-[var(--muted)]">
                                Atau bayar ke kasir dan tunjukkan nomor meja
                            </p>
                            <p className="font-semibold">
                                Meja {tableNumber || '-'} &bull; Order #{orderData._id?.slice(-6)}
                            </p>
                        </div>
                        <Link href="/" className="btn-primary w-full block text-center">
                            Selesai
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'success' && orderData) {
        return (
            <div className="min-h-screen bg-[var(--background)]">
                <div className="max-w-lg mx-auto px-4 py-12">
                    <div className="card p-8 text-center space-y-6">
                        <svg className="w-20 h-20 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <h1 className="text-2xl font-bold">Pesanan Berhasil!</h1>
                        <p className="text-[var(--muted)]">
                            Pesananmu sedang diproses. Silakan tunggu di meja {tableNumber || '-'}.
                        </p>
                        <div className="bg-[var(--secondary)] rounded-xl p-6 space-y-2">
                            <p className="text-sm text-[var(--muted)]">Total Pembayaran</p>
                            <p className="text-3xl font-bold text-[var(--primary)]">
                                {formatPrice(orderData.totalPrice)}
                            </p>
                            <p className="text-sm text-[var(--muted)]">
                                Metode: {orderData.paymentMethod === 'cash' ? 'Bayar ke Kasir' : 'QRIS'}
                            </p>
                        </div>
                        <Link href="/" className="btn-primary w-full block text-center">
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (step === 'checkout') {
        return (
            <div className="min-h-screen bg-[var(--background)]">
                <div className="max-w-lg mx-auto px-4 py-12">
                    <button
                        onClick={() => setStep('cart')}
                        className="text-[var(--primary)] text-sm hover:underline mb-6 block"
                    >
                        &larr; Kembali ke Keranjang
                    </button>

                    <div className="card p-8 space-y-6">
                        <h1 className="text-2xl font-bold">Detail Pesanan</h1>

                        <div>
                            <label className="block text-sm font-medium mb-1">Nama (opsional)</label>
                            <input
                                type="text"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                placeholder="Masukkan nama kamu"
                                className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-3">Metode Pembayaran</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setPaymentMethod('cash')}
                                    className={`p-4 rounded-xl border-2 text-center transition-all ${paymentMethod === 'cash'
                                        ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                                        : 'border-[var(--border)]'
                                        }`}
                                >
                                    <svg className="w-8 h-8 mx-auto mb-1 text-[var(--foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                    <span className="font-medium text-sm">Bayar ke Kasir</span>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('qris')}
                                    className={`p-4 rounded-xl border-2 text-center transition-all ${paymentMethod === 'qris'
                                        ? 'border-[var(--primary)] bg-[var(--primary)]/5'
                                        : 'border-[var(--border)]'
                                        }`}
                                >
                                    <svg className="w-8 h-8 mx-auto mb-1 text-[var(--foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
                                    <span className="font-medium text-sm">QRIS</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-lg pt-2 border-t border-[var(--border)]">
                            <span className="font-medium">Total</span>
                            <span className="font-bold text-[var(--primary)] text-2xl">{formatPrice(totalPrice)}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={loading}
                            className="btn-primary w-full py-4 text-lg disabled:opacity-50"
                        >
                            {loading ? 'Memproses...' : 'Pesan Sekarang'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/" className="text-[var(--primary)] text-sm hover:underline mb-2 block">
                            &larr; Kembali
                        </Link>
                        <h1 className="text-3xl font-bold">Keranjang</h1>
                    </div>
                    {tableNumber && (
                        <div className="text-right">
                            <p className="text-sm text-[var(--muted)]">Meja</p>
                            <p className="text-xl font-bold">{tableNumber}</p>
                        </div>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className="card p-16 text-center">
                        <svg className="w-20 h-20 mx-auto mb-6 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        <h2 className="text-2xl font-semibold mb-2">Keranjang kosong</h2>
                        <p className="text-[var(--muted)] mb-6">Tambahkan menu dari daftar menu</p>
                        <Link href="/menu" className="btn-primary inline-block">
                            Lihat Menu
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 mb-8">
                            {items.map((item) => (
                                <div key={item._id} className="card p-4 flex gap-4">
                                    <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--secondary)]">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-8 h-8 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2a3 3 0 00-3 3v1h6V5a3 3 0 00-3-3zM7 8h10l-1 14H8L7 8z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5h14v2H5z" /></svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                                <p className="text-[var(--primary)] font-bold mt-1">{formatPrice(item.price)}</p>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item._id)}
                                                className="text-red-500 hover:text-red-600 p-1"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-3 mt-3">
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                className="w-9 h-9 rounded-full border border-[var(--border)] flex items-center justify-center hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center font-semibold text-lg">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                className="w-9 h-9 rounded-full border border-[var(--border)] flex items-center justify-center hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="card p-6 space-y-4">
                            <div className="flex items-center justify-between text-xl">
                                <span className="font-semibold">Total</span>
                                <span className="font-bold text-[var(--primary)] text-2xl">{formatPrice(totalPrice)}</span>
                            </div>
                            <button
                                onClick={() => setStep('checkout')}
                                className="btn-primary w-full py-4 text-lg"
                            >
                                Lanjut ke Pembayaran
                            </button>
                            <button
                                onClick={clearCart}
                                className="w-full text-center text-[var(--muted)] hover:text-red-500 transition-colors text-sm py-2"
                            >
                                Kosongkan Keranjang
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
