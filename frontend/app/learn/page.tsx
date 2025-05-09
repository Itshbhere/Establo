import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LearnPage() {
  return (
    <div className="container py-12">
      <h1 className="mb-8 text-center text-4xl font-bold md:text-5xl">
        <span className="gradient-text">Learn</span> About Establo
      </h1>
      
      <p className="mx-auto mb-10 max-w-2xl text-center text-lg text-establo-offwhite">
        Understand how Establo works as a multi-backed stablecoin system, powered by both 
        USDT reserves and real estate assets on the Solana blockchain.
      </p>
      
      {/* Main Content Grid */}
      <div className="grid gap-10 md:grid-cols-12">
        {/* Sidebar Navigation */}
        <div className="md:col-span-3">
          <div className="sticky top-24 rounded-lg border border-establo-purple/20 bg-gradient-to-br from-establo-purple-dark/5 to-establo-purple-light/5 p-6">
            <h2 className="mb-4 text-xl font-bold">Resources</h2>
            
            <nav>
              <ul className="space-y-2">
                <li>
                  <a href="#overview" className="block rounded-md p-2 text-establo-offwhite hover:bg-establo-purple/10 hover:text-establo-white">
                    Overview
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="block rounded-md p-2 text-establo-offwhite hover:bg-establo-purple/10 hover:text-establo-white">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#dual-backing" className="block rounded-md p-2 text-establo-offwhite hover:bg-establo-purple/10 hover:text-establo-white">
                    Dual Backing System
                  </a>
                </li>
                <li>
                  <a href="#rwa-marketplace" className="block rounded-md p-2 text-establo-offwhite hover:bg-establo-purple/10 hover:text-establo-white">
                    RWA Marketplace
                  </a>
                </li>
                <li>
                  <a href="#security" className="block rounded-md p-2 text-establo-offwhite hover:bg-establo-purple/10 hover:text-establo-white">
                    Security & Audits
                  </a>
                </li>
                <li>
                  <a href="#faq" className="block rounded-md p-2 text-establo-offwhite hover:bg-establo-purple/10 hover:text-establo-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </nav>
            
            <div className="mt-6 space-y-4">
              <Button variant="gradient" className="w-full" size="sm" asChild>
                <Link href="/whitepaper">Whitepaper</Link>
              </Button>
              <Button variant="outline" className="w-full" size="sm" asChild>
                <Link href="https://github.com/establo" target="_blank">GitHub</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-9">
          <div className="space-y-12">
            {/* Overview */}
            <section id="overview" className="scroll-mt-24">
              <h2 className="mb-4 text-3xl font-bold">
                <span className="gradient-text">Overview</span>
              </h2>
              
              <div className="rounded-lg bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/10 p-6">
                <p className="mb-4 text-establo-offwhite">
                  Establo is a next-generation stablecoin designed to address the limitations of current 
                  stablecoin systems by introducing a dual-backing mechanism. Unlike traditional stablecoins
                  that rely solely on cash reserves or cryptocurrency collateral, Establo is backed by both:
                </p>
                
                <ul className="mb-4 list-inside list-disc space-y-2 text-establo-offwhite">
                  <li><span className="font-medium text-establo-white">USDT Reserves (70%)</span> - Providing liquidity and stability</li>
                  <li><span className="font-medium text-establo-white">Real Estate Assets (30%)</span> - Adding real-world value and protection against inflation</li>
                </ul>
                
                <p className="text-establo-offwhite">
                  This innovative approach creates a stablecoin that combines the best aspects of 
                  both digital and traditional finance, offering users enhanced stability, transparency, 
                  and protection against market volatility.
                </p>
              </div>
            </section>
            
            {/* How It Works */}
            <section id="how-it-works" className="scroll-mt-24">
              <h2 className="mb-4 text-3xl font-bold">
                <span className="gradient-text">How It Works</span>
              </h2>
              
              <div className="space-y-6">
                <div className="rounded-lg bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/10 p-6">
                  <h3 className="mb-3 text-xl font-bold">Minting Process</h3>
                  
                  <p className="mb-4 text-establo-offwhite">
                    Users can mint Establo stablecoins by depositing USDT into the protocol. 
                    The minting process is simple:
                  </p>
                  
                  <ol className="ml-4 list-decimal space-y-2 text-establo-offwhite">
                    <li>Connect your wallet to the Establo platform</li>
                    <li>Deposit USDT to the minting contract</li>
                    <li>Receive Establo tokens at a 1:1 ratio (minus any transaction fees)</li>
                    <li>Your USDT is added to the reserve pool, maintaining the backing ratio</li>
                  </ol>
                </div>
                
                <div className="rounded-lg bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/10 p-6">
                  <h3 className="mb-3 text-xl font-bold">Redemption Process</h3>
                  
                  <p className="mb-4 text-establo-offwhite">
                    Establo can be redeemed for USDT at any time:
                  </p>
                  
                  <ol className="ml-4 list-decimal space-y-2 text-establo-offwhite">
                    <li>Connect your wallet to the Establo platform</li>
                    <li>Initiate a redemption request</li>
                    <li>Burn your Establo tokens</li>
                    <li>Receive equivalent USDT (minus any redemption fees)</li>
                  </ol>
                </div>
              </div>
            </section>
            
            {/* Dual Backing */}
            <section id="dual-backing" className="scroll-mt-24">
              <h2 className="mb-4 text-3xl font-bold">
                <span className="gradient-text">Dual Backing System</span>
              </h2>
              
              <div className="space-y-6">
                <div className="rounded-lg bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/10 p-6">
                  <h3 className="mb-3 text-xl font-bold">USDT Reserves (70%)</h3>
                  
                  <p className="text-establo-offwhite">
                    The majority of Establo's backing comes from USDT reserves. These reserves are:
                  </p>
                  
                  <ul className="mt-3 list-inside list-disc space-y-2 text-establo-offwhite">
                    <li>Fully auditable and transparent</li>
                    <li>Available for redemptions at any time</li>
                    <li>Managed by secure smart contracts</li>
                    <li>Protected by multi-signature security</li>
                  </ul>
                </div>
                
                <div className="rounded-lg bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/10 p-6">
                  <h3 className="mb-3 text-xl font-bold">Real Estate Backing (30%)</h3>
                  
                  <p className="mb-4 text-establo-offwhite">
                    What makes Establo unique is its Real World Asset (RWA) backing through tokenized real estate:
                  </p>
                  
                  <ul className="list-inside list-disc space-y-2 text-establo-offwhite">
                    <li>Professionally selected and managed properties</li>
                    <li>Tokenized as NFTs on the Solana blockchain</li>
                    <li>Regular third-party valuations</li>
                    <li>Provides hedge against inflation</li>
                    <li>Creates stability beyond traditional stablecoins</li>
                  </ul>
                </div>
              </div>
            </section>
            
            {/* FAQ */}
            <section id="faq" className="scroll-mt-24">
              <h2 className="mb-6 text-3xl font-bold">
                <span className="gradient-text">Frequently Asked Questions</span>
              </h2>
              
              <div className="space-y-4">
                <FaqItem 
                  question="What makes Establo different from other stablecoins?"
                  answer="Establo is unique due to its dual-backing mechanism that combines USDT (70%) with real estate assets (30%). This provides enhanced stability and protection against market volatility compared to stablecoins backed solely by fiat or cryptocurrencies."
                />
                
                <FaqItem 
                  question="How is the real estate valuation maintained?"
                  answer="All real estate assets are regularly evaluated by independent, licensed property appraisers. These valuations are recorded on-chain to ensure transparency and accuracy. The protocol maintains conservative valuation policies to ensure stability."
                />
                
                <FaqItem 
                  question="Is Establo fully collateralized?"
                  answer="Yes, Establo is always fully collateralized at a minimum 100% ratio, with a target collateralization ratio of 108% to provide an additional safety buffer. The collateralization is transparent and verifiable on-chain."
                />
                
                <FaqItem 
                  question="What happens if real estate values decrease?"
                  answer="The protocol includes multiple safeguards against market downturns. The 70% USDT backing provides immediate liquidity, while the real estate portion is conservatively valued. If values decline significantly, the protocol's governance can authorize liquidation of at-risk properties and replacement with more stable assets."
                />
                
                <FaqItem 
                  question="How are redemptions handled?"
                  answer="Redemptions are processed immediately through smart contracts. Users can redeem their Establo tokens for USDT at any time at a 1:1 ratio (minus any applicable fees). The USDT reserves ensure there is always sufficient liquidity for redemptions."
                />
                
                <FaqItem 
                  question="Has Establo been audited?"
                  answer="Yes, Establo's smart contracts have been audited by leading security firms. Additionally, both the USDT reserves and real estate valuations are regularly audited by independent third parties to ensure compliance and accuracy."
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

function FaqItem({ question, answer }: { question: string, answer: string }) {
  return (
    <div className="rounded-lg bg-gradient-to-br from-establo-purple-dark/10 to-establo-purple-light/10 p-6">
      <h3 className="mb-2 text-xl font-bold">{question}</h3>
      <p className="text-establo-offwhite">{answer}</p>
    </div>
  )
} 