import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import dynamic from 'next/dynamic'
import { Toaster } from '@/components/ui/toaster'

// Import WalletContextProvider dynamically with { ssr: false }
const WalletContextProviderNoSSR = dynamic(
  () => import('@/components/solana/WalletContextProvider'),
  { ssr: false }
)

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Establo - Multi-Backed Stablecoin',
  description: 'A stablecoin backed by USDT and Real Estate assets on Solana',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletContextProviderNoSSR>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </WalletContextProviderNoSSR>
      </body>
    </html>
  )
} 