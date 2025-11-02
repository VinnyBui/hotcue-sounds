# HotCue Sounds
A modern **e-commerce platform** built for electronic music producers and DJs to browse, preview, and purchase high-quality techno sound packs.

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Shopify](https://img.shields.io/badge/Shopify-7AB55C?style=for-the-badge&logo=shopify&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=FF9900)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer--Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E3E?style=for-the-badge&logo=react&logoColor=white)
![OpenNext](https://img.shields.io/badge/OpenNext-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

## Preview

<div align="center">

### 🏠 Homepage
<img src="./public/preview/homepage.png" alt="HotCue Sounds Homepage" width="800"/>

### 🎧 Product Page
<img src="./public/preview/product.png" alt="HotCue Sounds Product Page" width="800"/>

### 💳 Checkout Page
<img src="./public/preview/checkout.png" alt="HotCue Sounds Checkout Page" width="800"/>

</div>

---
## About This Project

HotCue sounds is a project designed to demonstrate a **production-ready headless commerce architecture**. The goal of this project was to gain hands-on experience with real-world technologies commonly used in professional development environments including Shopify’s Storefront API for commerce data and AWS Cloud Services for infrastructure and deployment.

- **Shopify Storefront API** serves as the backend (product management, inventory, checkout)
- **Next.js** provides a completely custom frontend experience
- **AWS** hosts the entire application with global CDN, serverless functions, and secure infrastructure

Overall, HotCue Sounds serves as both a learning experience and a proof of concept for building high-performance, API-driven commerce applications in the cloud.

> **Note:** This is a portfolio/learning project demonstrating modern full-stack e-commerce development with cloud infrastructure. Products are for demonstration purposes.



**Live Site:** [https://hotcuesounds.com](https://hotcuesounds.com)

**Test the Checkout:**
The site uses a Shopify development store. To test the full checkout experience:
- Browse products and add items to cart
- When prompted at checkout, use password: `hotcue`


---
## Key Features

- 🎧 Browse and preview techno sound packs
- 🛒 Add to cart and complete checkout with Shopify integration
- ⚡️ Fast server-side rendering with Next.js and AWS Lambda
- 💾 Persistent cart using Zustand and localStorage
- 🖼️ Optimized images via AWS Lambda Image Optimization
- 🌐 Deployed on AWS CloudFront with global CDN

---

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User's Browser                          │
│                   (https://hotcuesounds.com)                    │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                │ DNS Lookup
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Route 53 (DNS)                             │
│         Returns: CloudFront Distribution (d54gq03...)           │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                │ HTTPS (SSL/TLS)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              CloudFront CDN (Global Edge Network)               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  SSL Certificate (ACM - us-east-1)                      │    │
│  │  - hotcuesounds.com                                     │    │
│  │  - www.hotcuesounds.com                                 │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  Routes by path pattern:                                        │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  / or /products/*  → Lambda SSR Function               │     │
│  │  /_next/image?*    → Lambda Image Optimization         │     │
│  │  /_next/static/*   → S3 Static Assets                  │     │ 
│  └────────────────────────────────────────────────────────┘     │
└────────┬──────────────────────┬──────────────────┬──────────────┘
         │                      │                  │
         ▼                      ▼                  ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   Lambda SSR    │  │  Lambda Image   │  │  S3 Bucket      │
│   Function      │  │  Optimization   │  │  (Private)      │
│                 │  │                 │  │                 │
│  • Next.js SSR  │  │  • Resize       │  │  • JS bundles   │
│  • React render │  │  • Compress     │  │  • CSS files    │
│  • Shopify API  │  │  • WebP convert │  │  • Build assets │
└────────┬────────┘  └─────────────────┘  └─────────────────┘
         │
         │ Reads secrets
         ▼
┌─────────────────────────────────────────────────────────────────┐
│              AWS Secrets Manager                                │
│  • NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN                         │
│  • NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN                             │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                │ GraphQL API calls
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Shopify Backend                            │
│  • Product Management                                           │
│  • Inventory                                                    │
│  • Cart API                                                     │
│  • Checkout                                                     │
│  • Customer Accounts                                            │
└─────────────────────────────────────────────────────────────────┘
```
---

## Getting Started

### Prerequisites
- Node.js 20+
- Shopify store with Storefront API access
- AWS account (for deployment)

### Local Development

```bash
# Clone the repository
git clone https://github.com/VinnyBui/hotcue-sounds.git
cd hotcue-sounds

# Install dependencies
npm install

# Set up environment variables
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

---

## Deployment

### AWS Deployment (Production)

This project uses **AWS CDK** (Infrastructure as Code) for automated deployment.

#### Prerequisites
- AWS CLI configured with credentials
- AWS CDK CLI installed: `npm install -g aws-cdk`
- Domain registered (Route 53 or external)

#### Deployment Steps

**1. Build Next.js App**
```bash
npm run build
```

**2. Convert to AWS Lambda Format (OpenNext)**
```bash
npx open-next build
```

This creates the `.open-next` folder with:
- `server-functions/default/` - SSR Lambda code
- `image-optimization-function/` - Image Optimization Lambda code
- `assets/` - Static files for S3

**3. Deploy Infrastructure**
```bash
cd infrastructure
cdk deploy
```

This creates:
- Lambda functions (SSR + Image Optimization)
- S3 bucket for static assets
- CloudFront distribution with custom cache policies
- Secrets Manager secret (update values in AWS Console)
- SSL certificate reference (must be created separately)

**4. Update Shopify Credentials in AWS**
```bash
# Make sure to update your, AWS Secrets Manager → Edit secret → Update JSON:
{
  "NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN": "your-token",
  "NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN": "your-store.myshopify.com"
}
```

### Infrastructure Stack Details

The CDK stack (`infrastructure/lib/infrastructure-stack.ts`) creates:

| Resource | Purpose |
|----------|---------|
| **S3 Bucket** | Private bucket for static assets (JS, CSS, images) |
| **Lambda SSR** | Runs Next.js server-side rendering |
| **Lambda Image Opt** | Optimizes images on-the-fly |
| **CloudFront** | Global CDN with custom cache policies |
| **Secrets Manager** | Securely stores Shopify API credentials |
| **ACM Certificate** | SSL/TLS for custom domain (us-east-1) |
| **Route 53** | DNS management for custom domain |

---

## Development Commands

```bash
npm run dev       # Start development server with Turbopack
npm run build     # Build for production with Turbopack
npm run start     # Start production server locally
npm run lint      # Run ESLint
```

---

## What I Learned

When building this project, I got to incorporate a lot of new technologies that I hadn’t worked with before. I learned how to integrate different tools and frameworks together to create a cohesive product, and I gained a deeper understanding of both front-end and back-end development. From setting up the architecture and managing state to handling authentication and deploying the app, each part of the process helped me strengthen my technical and problem-solving skills. I also learned the importance of clean code, reusable components, and proper version control when working on larger projects.

### Frontend Development
- **State Management**: Zustand for global cart state with localStorage persistence
- **Animations**: Framer Motion for smooth page transitions and interactions

### Shopify & E-commerce
- **Shopify Storefront API**: GraphQL queries for products, collections, cart
- **Headless Commerce Architecture**: Decoupling frontend from backend
- **Cart API**: Creating, updating, and managing carts
- **Customer Account API**: Authentication and user account management
- **Checkout Integration**: Redirecting to Shopify's hosted checkout

### AWS Cloud Infrastructure
- **AWS CDK (Infrastructure as Code)**: Defining infrastructure in TypeScript
- **AWS Lambda**: Serverless functions for SSR and image optimization
- **CloudFront CDN**:
  - Custom cache policies for different content types
  - Path-based routing to origins (Lambda vs S3)
  - SSL/TLS certificate management
- **S3**:
  - Private bucket configuration
  - Origin Access Control (OAC) for CloudFront
  - Static asset deployment with `aws-s3-deployment`
- **AWS Secrets Manager**: Secure credential storage and Lambda integration
- **AWS Certificate Manager (ACM)**: SSL certificate creation and DNS validation
- **Route 53**: DNS management and domain routing with Alias records

### Deployment & DevOps
- **OpenNext**: Adapting Next.js builds for AWS Lambda deployment
- **Cache Strategies**:
  - No cache for dynamic SSR pages
  - 1-day cache for optimized images (with query string variants)
  - Long-term cache for static assets (JS, CSS)
- **DNS Configuration**: Setting up custom domains with SSL

### Architecture & Design Patterns
- **Headless Commerce**: Understanding the benefits of API-first architecture
- **Server vs Client Components**: Optimizing for performance and interactivity
- **GraphQL**: Type-safe API queries with proper error handling

---

## Challenges & Solutions

### Challenge: Retrieving products listing and creating cart
**Problem:** Since this was my first time working with Shopify's API, I struggled a bit understanding how to retrieve my products from my shopify store and creating a cart state

**Solution:**
- I read through the shopify dev docs and learned how to use GraphQL to retrieve certain data from my shopify

### Challenge: Connecting my project to my AWS services
**Problem:** This was also my first time working with AWS CDK so I wasn't too familar on creating AWS services outside the website console. And I didn't know how to get all of my files into AWS S3 bucket without copy and paste it manually

**Solution:**
- I added open-next into my project, which took my Next.js build and transform it to a format that can run on AWS infrastruture

### Challenge: Image Optimization Not Working on CloudFront
**Problem:** Images returned 200 status but didn't display; CloudFront path pattern `_next/image*` didn't match Next.js URLs.

**Solution:**
- Recognized that my Next.js image URLs format: `/_next/image?url=...&w=800&q=75`
- Changed CloudFront behavior to exact match `_next/image` 

---

## Future Enhancements

### Features
- **Product Search**: Search functionality with Shopify search API
- **Wishlist**: Save products for later viewing
- **Reviews & Ratings**: Product reviews via Shopify metafields
- **Email Notifications**: Order confirmations and updates
- **Advanced Filtering**: Filter by price, BPM, genre tags
- **Collections Page**: Dedicated collection browsing

### Infrastructure
- **CI/CD Pipeline**: GitHub Actions for automated deployment
- **Cost Optimization**: Lambda power tuning, S3 lifecycle policies
- **Multi-Region**: Deploy to multiple AWS regions for lower latency
- **WAF**: AWS Web Application Firewall for security


---

## License

MIT License - See [LICENSE](./LICENSE) file for details

---

## Contact

**Built by Vinh Bui**

- **Portfolio**: [https://www.vinhbui.dev/](https://www.vinhbui.dev/)
- **LinkedIn**: [linkedin.com/in/vinhbui5](https://www.linkedin.com/in/vinhbui5)
- **GitHub**: [github.com/VinnyBui](https://github.com/VinnyBui)
- **Email**: vinh.bui0101@gmail.com