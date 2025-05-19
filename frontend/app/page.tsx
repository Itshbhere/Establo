import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { StatCard } from '@/components/ui/StatCards'
import DaoImpactCard from '@/components/DaoImpactCard'

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-establo-black py-24 lg:py-32">
        <div className="absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-establo-purple/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-establo-purple/20 blur-3xl"></div>
        
        {/* Floating elements for visual interest */}
        <div className="absolute top-1/4 left-1/4 h-8 w-8 rounded-full bg-establo-purple/40 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 h-12 w-12 rounded-full bg-establo-purple/30 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 right-1/3 h-6 w-6 rounded-full bg-establo-purple/20 animate-pulse" style={{animationDelay: '2s'}}></div>

        <div className="container relative z-10 flex flex-col items-center justify-center text-center">
          <div className="inline-flex items-center rounded-full bg-establo-purple/10 px-4 py-2 mb-6 border border-establo-purple/20">
            <span className="text-sm font-medium text-establo-purple-light">
              Hybrid-Backed Stablecoin on Solana
            </span>
          </div>
          <h1 className="mb-8 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
            <span className="gradient-text">Multi-Backed</span> Stablecoin <br className="hidden md:block" /> For The Future
          </h1>
          <p className="mb-10 max-w-2xl text-xl text-establo-offwhite">
            A stablecoin backed by USDT (70%) and real estate assets (30%) on the Solana blockchain,
            providing enhanced stability and real-world value.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
            <Button variant="gradient" size="lg" asChild className="text-lg px-8 py-6 h-auto font-medium">
              <Link href="/mint">Mint EUSD</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6 h-auto font-medium border-establo-purple/30 hover:bg-establo-purple/10">
              <Link href="/wallet">View Wallet</Link>
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-establo-offwhite">Fully Audited</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded-full bg-blue-500 animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <span className="text-sm text-establo-offwhite">100% Backed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-5 w-5 rounded-full bg-purple-500 animate-pulse" style={{animationDelay: '1s'}}></div>
              <span className="text-sm text-establo-offwhite">Real Estate Collateral</span>
            </div>
          </div>
        </div>
      </section>

      {/* What is EUSD */}
      <section className="container">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            <span className="gradient-text">What is EUSD?</span>
          </h2>
          <p className="text-xl text-establo-offwhite mb-8">
            EUSD is a revolutionary stablecoin that combines the stability of USDT with the security 
            of real-world assets. This hybrid approach offers users unparalleled stability, 
            making EUSD the perfect solution for those seeking a reliable digital currency in the volatile crypto market.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/10 border border-establo-purple/20 transition-all hover:shadow-lg hover:shadow-establo-purple/10 hover:-translate-y-1">
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-establo-purple/20 mb-4">
                <svg className="h-6 w-6 text-establo-purple-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">1:1 Exchange</h3>
              <p className="text-center text-establo-offwhite text-sm">Mint and redeem EUSD at a 1:1 ratio with USDT</p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/10 border border-establo-purple/20 transition-all hover:shadow-lg hover:shadow-establo-purple/10 hover:-translate-y-1">
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-establo-purple/20 mb-4">
                <svg className="h-6 w-6 text-establo-purple-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Dual-Backed</h3>
              <p className="text-center text-establo-offwhite text-sm">70% USDT and 30% real estate assets</p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-xl bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/10 border border-establo-purple/20 transition-all hover:shadow-lg hover:shadow-establo-purple/10 hover:-translate-y-1">
              <div className="h-14 w-14 flex items-center justify-center rounded-full bg-establo-purple/20 mb-4">
                <svg className="h-6 w-6 text-establo-purple-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast & Efficient</h3>
              <p className="text-center text-establo-offwhite text-sm">Built on Solana's high-speed, low-fee blockchain</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="container py-12 bg-gradient-to-br from-establo-black to-establo-purple-dark/30 rounded-3xl">
        <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">
          <span className="gradient-text">Key Features</span>
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard
            title="Dual Backing"
            description="Backed by 70% USDT and 30% real estate assets for enhanced stability and reduced volatility."
            icon="dual-backing"
          />
          <FeatureCard
            title="Real Estate Value"
            description="Leverages real-world assets to provide tangible backing and potential for value appreciation."
            icon="real-estate"
          />
          <FeatureCard
            title="Solana Speed"
            description="Built on Solana for lightning-fast transactions and minimal fees, making EUSD practical for everyday use."
            icon="speed"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="container">
        <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">
          <span className="gradient-text">How It Works</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="rounded-xl bg-gradient-to-br from-establo-purple-dark/20 to-establo-purple-dark/10 border border-establo-purple/20 p-6 relative transition-all hover:shadow-lg hover:shadow-establo-purple/10">            <div className="absolute -top-4 -left-4 h-10 w-10 flex items-center justify-center rounded-full bg-establo-purple text-white font-bold">1</div>            <h3 className="mb-4 text-xl font-bold">Mint EUSD</h3>            <p className="text-establo-offwhite">              Deposit USDT to mint EUSD tokens at a 1:1 ratio. Your USDT contributes to the stablecoin's              liquidity backing, ensuring stability and redeemability.            </p>          </div>
          <div className="rounded-xl bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/10 border border-establo-purple/20 p-6 relative transition-all hover:shadow-lg hover:shadow-establo-purple/10">
            <div className="absolute -top-4 -left-4 h-10 w-10 flex items-center justify-center rounded-full bg-establo-purple text-white font-bold">2</div>
            <h3 className="mb-4 text-xl font-bold">Real Estate Backing</h3>
            <p className="text-establo-offwhite">
              30% of EUSD's backing comes from tokenized real estate assets, providing additional
              stability through tangible, appreciating assets.
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/10 border border-establo-purple/20 p-6 relative transition-all hover:shadow-lg hover:shadow-establo-purple/10">
            <div className="absolute -top-4 -left-4 h-10 w-10 flex items-center justify-center rounded-full bg-establo-purple text-white font-bold">3</div>
            <h3 className="mb-4 text-xl font-bold">Use EUSD</h3>
            <p className="text-establo-offwhite">
              Use EUSD for DeFi applications, payments, or hold as a stable store of value.
              It maintains a stable value with the additional security of real estate backing.
            </p>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/10 border border-establo-purple/20 p-6 relative transition-all hover:shadow-lg hover:shadow-establo-purple/10">
            <div className="absolute -top-4 -left-4 h-10 w-10 flex items-center justify-center rounded-full bg-establo-purple text-white font-bold">4</div>
            <h3 className="mb-4 text-xl font-bold">Redeem Anytime</h3>
            <p className="text-establo-offwhite">
              Redeem your EUSD tokens for USDT at any time at a 1:1 ratio, with no redemption fees
              or waiting periods.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container py-12 rounded-3xl bg-gradient-to-br from-establo-purple-dark/30 to-establo-purple-dark/10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 flex">
            <div className="flex flex-col justify-between h-full p-4">
              <h2 className="text-3xl font-semibold text-white mb-4">
                Real-time <span className="gradient-text">Metrics</span>
              </h2>
              <p className="text-xl text-establo-offwhite">
                EUSD's real-time statistics showcase the strength and utility of our multi-backed stablecoin.
                Monitor the growth as adoption increases across DeFi and real-world use cases.
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/2 grid grid-cols-2 gap-6">
            <div className="rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/5 p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <h3 className="text-sm font-medium text-establo-offwhite">Total Value Locked</h3>
              </div>
              <p className="text-3xl font-bold text-green-500">$23.4M</p>
            </div>

            <div className="rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/5 p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-establo-purple"></div>
                <h3 className="text-sm font-medium text-establo-offwhite">Users</h3>
              </div>
              <p className="text-3xl font-bold text-establo-purple">15.2K</p>
            </div>

            <div className="rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/5 p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <h3 className="text-sm font-medium text-establo-offwhite">EUSD Supply</h3>
              </div>
              <p className="text-3xl font-bold text-blue-500">$9.8M</p>
            </div>

            <div className="rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/5 p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                <h3 className="text-sm font-medium text-establo-offwhite">Tx Volume</h3>
              </div>
              <p className="text-3xl font-bold text-amber-500">120K</p>
            </div>
          </div>
        </div>
      </section>

      {/* DAO Impact Card */}
      <section className="container">
        <DaoImpactCard />
      </section>

      {/* CTA Section */}
      <section className="container">
      <div className="overflow-hidden rounded-xl bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-dark/90 p-10 text-center flex flex-col md:flex-row md:items-center">
      <div className="md:w-3/4 mb-6 md:mb-0 md:text-left">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Ready to Experience the Future of Stablecoins?
            </h2>
            <p className="mb-0 md:max-w-2xl text-lg text-white/90">
              Join the growing community of users who trust EUSD for stability, security, and innovation.
            </p>
          </div>
          <div className="md:w-1/4 flex justify-center md:justify-end">
            <Button size="lg" variant="outline" className="border-white bg-white/10 text-white hover:bg-white/20 px-8 py-6 h-auto text-lg font-medium" asChild>
              <Link href="/mint">Get Started Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ title, description, icon }: { title: string, description: string, icon: string }) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-establo-purple-dark/20 to-establo-purple-dark/10 border border-establo-purple/20 p-6 transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-establo-purple/10">
      <div className="mb-6 h-14 w-14 rounded-full bg-establo-purple/20 flex items-center justify-center">
        {icon === 'dual-backing' && (
          <svg className="h-6 w-6 text-establo-purple-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        )}
        {icon === 'real-estate' && (
          <svg className="h-6 w-6 text-establo-purple-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
        )}
        {icon === 'speed' && (
          <svg className="h-6 w-6 text-establo-purple-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        )}
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-establo-offwhite">{description}</p>
    </div>
  );
} 