import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { StatCard } from '@/components/ui/StatCards'
import DaoImpactCard from '@/components/DaoImpactCard'
export default function Home() {
  const dummyData = {
    title: "Revenue",
    value: "$12.5K",
    live: true,
    prefix: "$",
    suffix: "K",
    delay: 0.2,
    inView: true,
  };
  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-establo-black py-20">
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-establo-purple/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-establo-purple/20 blur-3xl"></div>

        <div className="container relative z-10 flex flex-col items-center justify-center text-center">
          <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl">
            <span className="gradient-text">Multi-Backed</span> Stablecoin <br /> For The Future
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
      <div className="container flex flex-col md:flex-row gap-8">
        {/* Left 50% - Heading at top, Paragraph at bottom */}
        <div className="w-full md:w-1/2 flex">
          <div className="flex flex-col justify-between h-full p-4">
            <h2 className="text-3xl font-semibold text-white">Trusted by millions</h2>
            <p className="text-xl text-establo-offwhite">
              Establo's real-time revenue and stats showcase the strength and utility of a multi-backed stablecoin.
              Monitor the growth as adoption increases across DeFi and real-world use cases.
            </p>
          </div>
        </div>

        {/* Right 50% - 2x2 Grid of StatCards */}
        <div className="w-full md:w-1/2 grid grid-cols-2 gap-6">
          <StatCard title="Revenue" value="23.4" prefix="$" suffix="M" live={true} inView={true} />
          <StatCard title="Users" value="15.2" suffix="K" prefix="" live={false} inView={true} />
          <StatCard title="TVL" value="9.8" prefix="$" suffix="M" live={false} inView={true} />
          <StatCard title="Tx Volume" value="120" suffix="K" prefix={""} live={false} inView={true} />
        </div>
      </div>


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
      <section className="container">
        <DaoImpactCard />
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