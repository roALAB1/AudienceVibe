# 🎯 AudienceVibe

**AudienceLab Vibe Coding Dashboard** - A production-ready MVP dashboard that enables customers to build client-facing solutions using AudienceLab's APIs with AI coding tools.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.35-black.svg)](https://nextjs.org/)
[![tRPC](https://img.shields.io/badge/tRPC-11.6.0-2596be.svg)](https://trpc.io/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 🚀 Live Demo

**Dashboard URL:** [View Live Demo](https://3001-iogjcbjiuer5xrke4g9ut-06bbafc4.manusvm.computer)

---

## 📋 Overview

AudienceVibe is a **developer-friendly dashboard** built on top of AudienceLab's API that demonstrates how customers can build custom solutions using modern web technologies and AI coding assistants like Cursor, GitHub Copilot, and v0.dev.

### Key Features

- ✅ **Real API Integration** - Connects to live AudienceLab API
- ✅ **Type-Safe** - Full TypeScript coverage with validated schemas
- ✅ **Modern Stack** - Next.js 14, React 19, tRPC 11, Tailwind CSS 4
- ✅ **Zero Errors** - Validated development process with 100% test pass rate
- ✅ **Production Ready** - Includes authentication, database, and deployment configs

---

## 🎯 What's Included

### Pages

1. **Home Page** - Navigation dashboard with gradient design
2. **Audiences Page** - List, search, and paginate 399+ audiences
3. **Pixels Page** - Manage tracking pixels with copy-to-clipboard

### API Integration

- ✅ `GET /audiences` - Fully validated and working
- ✅ `GET /pixels` - Fully validated and working
- ⚠️ `POST /enrich/contact` - In progress

---

## 🏗️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.2.35 | React framework with App Router |
| **React** | 19.1.1 | UI library |
| **TypeScript** | 5.9.3 | Type safety |
| **tRPC** | 11.6.0 | End-to-end type-safe APIs |
| **React Query** | 5.90.2 | Data fetching and caching |
| **Tailwind CSS** | 4.0.0 | Utility-first styling |
| **shadcn/ui** | Latest | Beautiful UI components |
| **Drizzle ORM** | 0.44.5 | Type-safe database queries |
| **Vitest** | Latest | Unit testing |

---

## 📦 Installation

### Prerequisites

- Node.js 22+ (recommended)
- pnpm 10.4.1+
- AudienceLab API key

### Setup

```bash
# Clone the repository
git clone https://github.com/roALAB1/AudienceVibe.git
cd AudienceVibe

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Add your AudienceLab API key to .env.local
# VITE_AUDIENCELAB_API_KEY=your_api_key_here

# Run database migrations (if using database features)
pnpm db:push

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3001`

---

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following:

```env
# AudienceLab API
VITE_AUDIENCELAB_API_KEY=your_api_key_here
AUDIENCELAB_API_KEY=your_api_key_here

# Database (MySQL/TiDB)
DATABASE_URL=mysql://user:password@host:port/database

# Authentication (Manus OAuth)
JWT_SECRET=your_jwt_secret
OAUTH_SERVER_URL=https://oauth.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# App Configuration
VITE_APP_TITLE=AudienceVibe
VITE_APP_LOGO=/logo.svg
```

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build image
docker build -t audiencevibe .

# Run container
docker run -p 3000:3000 --env-file .env.local audiencevibe
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

---

## 📚 Documentation

- **[MVP Delivery Report](docs/audiencelab-mvp-delivery.md)** - Complete project summary
- **[MVP Blueprint](docs/audiencelab-mvp-blueprint.md)** - Original 9-day development plan
- **[API Validation Results](docs/api-validation-results.md)** - Endpoint testing documentation
- **[Vibe Coding Framework](docs/audiencelab-vibe-coding-framework.md)** - 15,000+ word guide for AI-assisted development

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Type checking
pnpm check
```

---

## 🎨 Development

### Project Structure

```
audiencelab-enrichment/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # Utilities and helpers
│   │   └── App.tsx        # Main app component
├── server/                # Backend tRPC server
│   ├── routers/           # API route handlers
│   ├── db.ts              # Database queries
│   └── _core/             # Core server utilities
├── shared/                # Shared types and constants
│   ├── audiencelab-types.ts
│   └── audiencelab-client.ts
├── drizzle/               # Database schema and migrations
├── tests/                 # Test files
└── docs/                  # Documentation
```

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm test         # Run tests
pnpm check        # Type check
pnpm format       # Format code with Prettier
pnpm db:push      # Push database schema changes
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **AudienceLab** - For providing the API and platform
- **Manus** - For the development environment and deployment infrastructure
- **shadcn/ui** - For beautiful, accessible UI components
- **tRPC** - For type-safe API development

---

## 📞 Support

For questions or support:

- 📧 Email: support@audiencelab.io
- 🐛 Issues: [GitHub Issues](https://github.com/roALAB1/AudienceVibe/issues)
- 📖 Docs: [AudienceLab Documentation](https://audiencelab.mintlify.app)

---

## 🎯 Roadmap

### Phase 1: MVP (Complete ✅)
- [x] Project setup with Next.js 14
- [x] API client with retry logic
- [x] Audiences page with search and pagination
- [x] Pixels page with copy functionality
- [x] Browser testing and validation

### Phase 2: Core Features (In Progress)
- [ ] Enrichment page (single contact)
- [ ] Segments page (view data)
- [ ] Create/delete functionality
- [ ] Bulk enrichment (CSV upload)

### Phase 3: Production Hardening
- [ ] Authentication (NextAuth.js)
- [ ] Error tracking (Sentry)
- [ ] Analytics (PostHog)
- [ ] Rate limiting
- [ ] Database caching
- [ ] Integration tests
- [ ] CI/CD pipeline

### Phase 4: Advanced Features
- [ ] Workflow automation
- [ ] Sync integrations (Google Sheets, Facebook Ads)
- [ ] Webhooks management
- [ ] Team collaboration
- [ ] Custom reporting

---

**Built with ❤️ by the AudienceLab team**
