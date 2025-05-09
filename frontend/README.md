# Establo Frontend

A sleek, modern frontend for the Establo multi-backed stablecoin protocol on Solana.

## Features

- **Modern UI**: Built with Next.js, React, TypeScript, and Tailwind CSS
- **Dark Theme**: Elegant dark theme with black, white, and purple color scheme
- **Gradient Accents**: Beautiful gradient effects throughout the interface
- **Responsive Design**: Fully responsive across all device sizes

## Pages

- **Home**: Introduction and key features of Establo
- **Mint**: Interface for minting Establo stablecoins
- **Dashboard**: User dashboard for tracking balances and transactions
- **RWA Marketplace**: Browse real estate assets backing the stablecoin
- **Learn**: Documentation and resources about Establo

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn

### Installation

1. Clone the repository:
```
git clone https://github.com/your-username/establo.git
cd establo/frontend
```

2. Install dependencies:
```
npm install
# or
yarn install
```

3. Run the development server:
```
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide

## Project Structure

```
frontend/
├── app/                  # Next.js App Router
│   ├── dashboard/        # Dashboard page
│   ├── mint/             # Mint page
│   ├── rwa-marketplace/  # RWA Marketplace page
│   ├── learn/            # Learn page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── layout/           # Layout components
│   │   ├── Header.tsx    # Header component
│   │   └── Footer.tsx    # Footer component
│   └── ui/               # UI components
├── lib/                  # Utility functions
├── public/               # Static assets
└── ...                   # Configuration files
```

## Design Choices

- **Dark Theme**: Primary background is black (#0A0A0A) with white text and purple accents
- **Purple Accents**: Various shades of purple (#553C9A, #805AD5, #B794F4) for buttons and highlights
- **Gradient Effects**: Subtle gradients throughout the interface for a modern look
- **Card Components**: Rounded corners with subtle borders and shadows
- **Typography**: Clean and modern with proper hierarchy

## License

This project is licensed under the MIT License - see the LICENSE file for details. 