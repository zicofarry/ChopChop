'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';

export default function ClientLayout({ children }) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <CartProvider>
                    <div className="min-h-screen flex flex-col">
                        <Navbar />
                        <main className="flex-grow pt-20">
                            {children}
                        </main>
                        <Footer />
                        <CartDrawer />
                    </div>
                </CartProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}
