import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-establo-black py-20">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-establo-purple/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-establo-purple/20 blur-3xl"></div>
        
        <div className="container relative z-10 flex flex-col items-center justify-center text-center">
          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
            <span className="gradient-text">Multi-Backed</span> Stablecoin <br/> For The Future
          </h1>
          <p className="mb-8 max-w-2xl text-xl text-establo-offwhite">
            A stablecoin backed by USDT (70%) and real estate assets (30%) on the Solana blockchain, 
            providing enhanced stability and real-world value.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button variant="gradient" size="lg" asChild>
              <Link href="/mint">Mint Establo</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/learn">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="container">
        <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">
          <span className="gradient-text">Key Features</span>
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard 
            title="Dual Backing"
            description="Backed by 70% USDT and 30% real estate assets for enhanced stability and reduced volatility."
            icon="/icons/dual-backing.svg"
          />
          <FeatureCard 
            title="Real Estate Value"
            description="Leverages real-world assets through the RWA Marketplace to provide tangible backing."
            icon="/icons/real-estate.svg"
          />
          <FeatureCard 
            title="Solana Speed"
            description="Built on Solana for lightning-fast transactions and minimal fees."
            icon="/icons/speed.svg"
          />
        </div>
      </section>

      {/* How It Works */}
      <section className="container">
        <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">
          <span className="gradient-text">How It Works</span>
        </h2>
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-10 md:flex-row">
            <div className="flex-1 rounded-lg bg-gradient-to-br from-establo-purple-dark/20 to-establo-purple-light/20 p-10">
              <h3 className="mb-4 text-2xl font-bold">Mint Establo</h3>
              <p className="text-establo-offwhite">
                Deposit USDT to mint Establo tokens at a 1:1 ratio. Your USDT contributes to the stablecoin's
                liquidity backing, ensuring stability and redeemability.
              </p>
            </div>
            <div className="flex-1 rounded-lg bg-gradient-to-br from-establo-purple-dark/20 to-establo-purple-light/20 p-10">
              <h3 className="mb-4 text-2xl font-bold">Real Estate Backing</h3>
              <p className="text-establo-offwhite">
                30% of Establo's backing comes from tokenized real estate assets, providing additional
                stability through tangible, appreciating assets.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-10 md:flex-row">
            <div className="flex-1 rounded-lg bg-gradient-to-br from-establo-purple-dark/20 to-establo-purple-light/20 p-10">
              <h3 className="mb-4 text-2xl font-bold">Use Establo</h3>
              <p className="text-establo-offwhite">
                Use Establo for DeFi applications, payments, or hold as a stable store of value.
                It maintains a stable value with the additional security of real estate backing.
              </p>
            </div>
            <div className="flex-1 rounded-lg bg-gradient-to-br from-establo-purple-dark/20 to-establo-purple-light/20 p-10">
              <h3 className="mb-4 text-2xl font-bold">Redeem Anytime</h3>
              <p className="text-establo-offwhite">
                Redeem your Establo tokens for USDT at any time at a 1:1 ratio, with no redemption fees
                or waiting periods.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container">
        <div className="overflow-hidden rounded-xl bg-purple-gradient p-10 text-center">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">
            Ready to Experience the Future of Stablecoins?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/90">
            Join the growing community of users who trust Establo for stability, security, and innovation.
          </p>
          <Button size="lg" variant="outline" className="border-white bg-white/10 text-white hover:bg-white/20" asChild>
            <Link href="/mint">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ title, description, icon }: { title: string, description: string, icon: string }) {
  return (
    <div className="rounded-lg bg-gradient-to-br from-establo-purple-dark/20 to-establo-purple-light/20 p-6 transition-transform hover:-translate-y-1">
      <div className="mb-4 h-12 w-12 rounded-full bg-establo-purple p-3">
        <div className="h-full w-full rounded-full bg-establo-black p-1.5">
          {/* Replace with actual icons */}
          <div className="h-full w-full rounded-full bg-establo-purple"></div>
        </div>
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-establo-offwhite">{description}</p>
    </div>
  );
} 