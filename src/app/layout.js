import { Calistoga, Cabin_Condensed } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import CartSidebar from '@/components/CartSidebar'

const calistoga = Calistoga({ 
  weight: '400',
  subsets: ['latin'],
  variable: '--font-calistoga'
})

const cabinCondensed = Cabin_Condensed({ 
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cabin-condensed'
})

export const metadata = {
  title: 'Korean Fusion Food Truck',
  description: 'Celebrating Korean flavors with an American twist—served fresh from our kitchen and food truck to you.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${calistoga.variable} ${cabinCondensed.variable} font-sans`}>
        <AuthProvider>
          <CartProvider>
            <Navigation />
            <CartSidebar />
            <main className="min-h-screen">
              {children}
            </main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
