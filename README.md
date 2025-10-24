# HotCue Sounds

A modern headless e-commerce platform for DJ sounds, samples, and tools built with Next.js and Shopify.

> **Note:** This is a portfolio/learning project created to demonstrate modern e-commerce development skills. Products are not real.

## About This Project

HotCue Sounds showcases a **headless commerce architecture** where Shopify serves as the backend (product management, cart, checkout) while Next.js provides a completely custom frontend experience. This separation allows for:

- Full control over the user experience
- Modern React patterns and performance optimizations
- Custom audio preview functionality
- Seamless integration with Shopify's powerful e-commerce backend

**Purpose:** Built to gain hands-on experience with Shopify's Storefront API, GraphQL, and modern React patterns while creating a portfolio-ready project.

## Features

- 🛍️ **Product Browsing** - Dynamic product pages with category filtering
- 🛒 **Shopping Cart** - Full cart functionality with Shopify Cart API integration
- 🔐 **Authentication** - Customer login, signup, and account management
- 📦 **Order History** - View past purchases with detailed order information
- 🎵 **Audio Preview** - Custom audio player for previewing sound samples
- 🌓 **Theme Toggle** - Dark/light mode with system preference support
- 📱 **Responsive Design** - Mobile-first approach with seamless desktop experience
- 🔍 **SEO Optimized** - Dynamic metadata, sitemap generation, and semantic HTML

## Tech Stack

### Frontend
- **Framework:** Next.js 15.5.4 (App Router with Turbopack)
- **React:** v19 with TypeScript
- **Styling:** Tailwind CSS v4 with custom theme system (OKLCH color space)
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Animations:** Framer Motion
- **Icons:** Lucide React

### Backend
- **E-commerce:** Shopify Storefront API (GraphQL)
- **Authentication:** Shopify Customer API
- **State Management:** Zustand for cart state

### Development
- **Language:** TypeScript
- **Build Tool:** Turbopack (Next.js)
- **Theme System:** next-themes
- **Code Quality:** ESLint

## Architecture Highlights

### Headless Commerce Pattern
- Shopify admin handles product/inventory management and checkout
- Next.js frontend provides custom UI/UX
- GraphQL for efficient data fetching
- Cart state managed client-side with Zustand, synced to Shopify

### Component Organization
- **Server Components** (default): Pages and data-fetching components
- **Client Components** (`"use client"`): Interactive UI, forms, hooks
- **Feature-based structure**: Components organized by domain (cart/, products/, layout/)
- **Barrel exports**: Clean imports via index.ts files

### Type Safety
- Full TypeScript coverage
- Type-safe GraphQL queries
- Shopify API response types

## Getting Started

### Prerequisites
- Node.js 20+
- Shopify store with Storefront API access

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd hotcue-sounds

# Install dependencies
npm install

# Set up environment variables (see below)
# Create .env.local with your Shopify credentials

# Run development server
npm run dev

# Open http://localhost:3000
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your-storefront-access-token
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Optional, for sitemap
```

**Getting Shopify Credentials:**
1. Go to Shopify Admin → Settings → Apps and sales channels → Develop apps
2. Create a custom app or select existing
3. Enable Storefront API access with required scopes
4. Copy your Storefront API access token

For detailed setup instructions, see `CLAUDE.md`.

## Development Commands

```bash
npm run dev    # Start development server with Turbopack
npm run build  # Build for production with Turbopack
npm run start  # Start production server
npm run lint   # Run ESLint
```

## What I Learned

Building this project gave me hands-on experience with:

### Shopify Integration
- Shopify Storefront API and GraphQL query optimization
- Headless commerce architecture and its benefits
- Cart API integration with state management
- Customer Account API for authentication


### State Management
- Zustand for global state management
- localStorage persistence strategies
- Async state updates with Shopify API

### Modern Development
- TypeScript in a production-scale application
- Component library integration (shadcn/ui)
- Tailwind CSS v4 with custom theming
- GraphQL type safety

## Future Enhancements

Planned features to expand the project:

-  **Product Search** - Search functionality with Shopify search API
-  **Wishlist** - Save products for later viewing
-  **Reviews & Ratings** - Product reviews via Shopify metafields
-  **Email Notifications** - Order confirmations and updates
-  **Advanced Filtering** - Filter by price, BPM, genre tags

## License

MIT License

---

**Built by Vinh Bui** | [Portfolio](https://www.vinhbui.dev/) | [LinkedIn](https://www.linkedin.com/in/vinhbui5) | [GitHub](https://github.com/VinnyBui)
