import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-establo-purple/20 bg-establo-black py-10">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img 
                src="/logo-establo.svg" 
                alt="Establo Logo" 
                className="h-8 w-8"
              />
              <h3 className="text-lg font-bold">Establo</h3>
            </div>
            <p className="text-sm text-establo-offwhite">
              A multi-backed stablecoin powered by USDT and real estate assets on Solana.
            </p>
          </div>
          
          <div>
            <h3 className="mb-3 text-lg font-bold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
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
            </ul>
          </div>
          
          <div>
            <h3 className="mb-3 text-lg font-bold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/learn" className="text-establo-offwhite hover:text-establo-white">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/whitepaper" className="text-establo-offwhite hover:text-establo-white">
                  Whitepaper
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-establo-offwhite hover:text-establo-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-3 text-lg font-bold">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                className="text-establo-offwhite hover:text-establo-purple">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer"
                className="text-establo-offwhite hover:text-establo-purple">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="4" />
                  <line x1="4.93" x2="19.07" y1="4.93" y2="19.07" />
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="text-establo-offwhite hover:text-establo-purple">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-10 border-t border-establo-purple/20 pt-6 text-center text-sm text-establo-offwhite">
          <p>© {new Date().getFullYear()} Establo Protocol. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 