import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "ChopChop Coffee | Premium Coffee Experience",
  description: "Experience the perfect blend of tradition and innovation at ChopChop Coffee. Enjoy our carefully crafted coffee and cozy atmosphere.",
  keywords: "coffee, cafe, coffee shop, premium coffee, ChopChop",
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfair.variable} ${dmSans.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
