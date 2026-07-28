import "./globals.css";
import { Navbar } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/lib/cart-context";
import { AuthProvider } from "@/lib/auth-context";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { FloatingBookCall } from "@/components/ui/FloatingBookCall";

export const metadata = {
  title: "Inaayika | Handcrafted Premium Jewellery",
  description: "Discover Inaayika by Pooja Khan, a premium destination for exquisite handcrafted jewellery. Timeless, elegant, and uniquely designed hand-made pieces.",
  keywords: "Inaayika, Pooja Khan, handmade jewellery, handcrafted jewellery, custom jewellery, premium necklaces, earrings, traditional jewellery, designer jewellery",
  authors: [{ name: "Inaayika" }],
  openGraph: {
    title: "Inaayika | Handcrafted Premium Jewellery",
    description: "Exquisite handcrafted jewellery designed to make you stand out. Browse our custom and handmade collections.",
    type: "website",
    locale: "en_IN",
    siteName: "Inaayika",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased overflow-x-hidden max-w-full w-full">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen max-w-full overflow-x-hidden">
              {children}
            </main>
            <Footer />
            <FloatingWhatsApp />
            <FloatingBookCall />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
