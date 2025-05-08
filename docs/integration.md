# RWA Marketplace & Stablecoin Integration

## Architecture Overview

This document outlines how the Real-World Asset (RWA) Marketplace integrates with the Stablecoin contract to create a multi-backed stablecoin system.

## Contract Integration

### 1. Stablecoin Backing Structure

The stablecoin is backed by two primary assets:
- USDT (70%)
- Real Estate Value from RWA Marketplace (30%)

This dual backing provides additional stability and reduces reliance on a single asset type.

### 2. Key Integration Points

#### From RWA Marketplace to Stablecoin:
- When a property is listed, its value is added to the stablecoin's real estate backing
- When a property value is updated, the stablecoin's backing is adjusted
- When a property is liquidated, its value is removed from the backing

#### From Stablecoin to RWA Marketplace:
- The stablecoin contract can query property values to verify backing
- Minting restrictions are enforced based on available backing from real estate

### 3. Data Flow

```
┌────────────────────┐       ┌────────────────────┐
│   RWA Marketplace  │◄──────┤    Stablecoin      │
│                    │       │                    │
│  - List RWA        │       │  - Mint tokens     │
│  - Update valuation│       │  - Burn tokens     │
│  - Transfer RWA    │       │  - Transfer tokens │
│  - Liquidate RWA   │       │  - Update reserves │
└─────────┬──────────┘       └─────────┬──────────┘
          │                            │
          │                            │
          ▼                            ▼
┌─────────────────────────────────────────────────┐
│                  Shared State                    │
│                                                  │
│  - Real Estate Value (from RWA Marketplace)      │
│  - USDT Reserves (managed by Stablecoin)         │
│  - Overall Backing Ratio                         │
└─────────────────────────────────────────────────┘
```

## Key Contract Interactions

### Listing an RWA
When a user lists a real estate property as an NFT:
1. Property details are recorded in the RWA Marketplace
2. Property value is added to the stablecoin's real estate backing
3. Enables additional minting capacity for the stablecoin

### Updating Property Valuation
When a property value changes:
1. New value is recorded in the RWA Marketplace
2. Stablecoin's backing is updated accordingly
3. If value decreases below liquidation threshold, property is marked "at risk"

### Liquidation Process
If a property value drops below the liquidation threshold:
1. Property is marked "at risk" in the RWA Marketplace
2. Admin can initiate liquidation to protect stablecoin stability
3. Property NFT is transferred to admin/marketplace
4. Property value is removed from stablecoin backing

## Security Considerations

### Stablecoin Stability
- Regular monitoring of backing ratio
- Liquidation thresholds to prevent undercollateralization
- Admin authority to manage extreme situations

### Asset Valuation
- Only property owner or admin can update valuations
- Only admin can decrease property values
- Clear liquidation rules to maintain stability

## Future Enhancements

1. **Oracle Integration**: External price feeds for more accurate real estate valuations
2. **DAO Governance**: Community governance of liquidation thresholds and other parameters
3. **Multi-chain Support**: Cross-chain bridges for real estate tokens from other networks
4. **Enhanced Yield Features**: Rental income distribution for stablecoin holders

## Implementation Notes

Both contracts share a common reference to the stablecoin config account, which serves as the central source of truth for reserve values and DAO information.
