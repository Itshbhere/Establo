'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

// Dynamically import WalletButton without SSR
const WalletButtonNoSSR = dynamic(
  () => import('@/components/solana/WalletButton'),
  { ssr: false }
)

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => setMenuOpen(prev => !prev)

  // Check if the current path matches the link
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }
  
  // Navigation links
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/wallet', label: 'Wallet' },
    { href: '/mint', label: 'Mint' },
    { href: '/burn', label: 'Redeem' },
    { href: '/transfer', label: 'Transfer' },
    { href: '/dashboard/dao-stats', label: 'DAO Stats' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-establo-purple/20 bg-establo-black/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/logo-establo.svg" 
              alt="Establo Logo" 
              className="h-8 w-8"
            />
            <span className="text-xl font-bold">Establo</span>
          </Link>
        </div>
        {/* Desktop Nav */}
        <nav className="hidden md:flex">
          <ul className="flex gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href} 
                  className={`transition-colors ${
                    isActive(link.href) 
                      ? 'text-establo-white font-medium' 
                      : 'text-establo-offwhite hover:text-establo-white'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Wallet & Burger */}
        <div className="flex items-center gap-4">
          <WalletButtonNoSSR />

          {/* Burger button for mobile */}
          <button className="block md:hidden" onClick={toggleMenu} aria-label="Toggle Menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24" height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-establo-white"
            >
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-establo-black px-4 py-4">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href} 
                  className={`block transition-colors ${
                    isActive(link.href) 
                      ? 'text-establo-white font-medium' 
                      : 'text-establo-offwhite hover:text-establo-white'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
