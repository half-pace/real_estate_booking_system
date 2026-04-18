# RealES — Premium Real Estate Booking Management System

A stunning, production-ready real estate booking platform built with the MERN stack. Features award-winning design aesthetics, smooth GSAP animations, and a complete booking management system.

![RealES](https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=400&fit=crop)

## ✨ Features

- **Premium Design** — Luxury aesthetic with gold accents, Playfair Display typography, and glass morphism effects
- **GSAP Animations** — Smooth scroll-triggered reveals, counter animations, 3D card tilts, and micro-interactions
- **Full Authentication** — JWT-based auth with role-based access (User, Agent, Admin)
- **Property Management** — Browse, search, filter, and sort 12+ luxury properties
- **Booking System** — Date selection, guest count, real-time pricing, and booking confirmation
- **User Dashboard** — Bookings management, favorites, profile settings
- **Agent Dashboard** — Property management, analytics, booking requests
- **Responsive Design** — Mobile-first approach, works on all devices

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, Tailwind CSS v4 |
| UI Components | Radix UI primitives (shadcn-style) |
| Animations | GSAP + ScrollTrigger |
| State | Zustand |
| Backend | Node.js + Express.js |
| Database | MySQL + Sequelize |
| Auth | JWT (JSON Web Tokens) |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account (free tier works)

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Ensure your `.env` files are configured for the server and client. Refer to `.env.example` if available.

### 3. Seed Database

```bash
cd server
npm run seed
```

This creates sample properties and test accounts:
- **Agent:** agent@reales.com
- **User:** user@reales.com
- **Admin:** admin@reales.com

### 4. Run Development Servers

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Visit **http://localhost:5173** to see the application.

## 📁 Project Structure

```
├── client/                    # React Frontend
│   ├── src/
│   │   ├── animations/       # GSAP animation configs
│   │   ├── components/
│   │   │   ├── layout/       # Navbar, Footer
│   │   │   ├── property/     # PropertyCard, etc.
│   │   │   └── ui/           # Button, Input, Badge (shadcn-style)
│   │   ├── pages/            # Home, Properties, Login, Dashboard
│   │   ├── services/         # Axios API service
│   │   ├── store/            # Zustand stores
│   │   └── utils/            # Helper functions
│   └── package.json
│
├── server/                    # Express Backend
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/       # Auth middleware
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API routes
│   │   ├── utils/            # Seed data
│   │   └── server.js         # Entry point
│   └── package.json
│
└── README.md
```

## 🎨 Design System

- **Colors:** Dark charcoal (#1A1A1A) with gold/brass accents (#C9A55C)
- **Typography:** Playfair Display (headings) + Work Sans (body)
- **Spacing:** 4px base grid (0.25rem increments)
- **Border Radius:** 12-16px for cards, 8-12px for inputs
- **Shadows:** Subtle depth with hover elevation

## 📡 API Endpoints

- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login user
- `GET /api/properties` — List properties (with filters)
- `GET /api/properties/:id` — Property details
- `POST /api/bookings` — Create booking (protected)
- `GET /api/bookings` — User's bookings (protected)
- `PUT /api/users/profile` — Update profile (protected)

## 📝 License

MIT
