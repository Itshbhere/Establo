import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'

// Import WalletButton dynamically with no SSR
const WalletButtonNoSSR = dynamic(
  () => import('@/components/solana/WalletButton'),
  { ssr: false }
)

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-establo-purple/20 bg-establo-black/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-purple-gradient"></div>
            <span className="text-xl font-bold">Establo</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex">
          <ul className="flex gap-8">
            <li>
              <Link href="/" className="text-establo-offwhite hover:text-establo-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/mint" className="text-establo-offwhite hover:text-establo-white">
                Mint
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="text-establo-offwhite hover:text-establo-white">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/rwa-marketplace" className="text-establo-offwhite hover:text-establo-white">
                RWA Marketplace
              </Link>
            </li>
            <li>
              <Link href="/learn" className="text-establo-offwhite hover:text-establo-white">
                Learn
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="flex items-center gap-4">
          <WalletButtonNoSSR />
          <button className="block md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-establo-white"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
} 