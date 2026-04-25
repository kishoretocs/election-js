# Tamil Nadu Election Results Dashboard

## Overview
An interactive dashboard for displaying Tamil Nadu Legislative Assembly election results with real-time vote tracking and a reporter vote entry system.

## Key Features
- **Interactive Tamil Nadu Map**: SVG-based map with all 38 districts, clickable with hover tooltips
- **Drill-down Navigation**: State → District → Constituency with breadcrumb navigation
- **Vote Results Display**:
  - Party vote cards for DMK, AIADMK, TVK, Naam Tamilar, Others
  - Round-wise vote status with progress bars
  - Area-wise (Taluk/Booth) vote status with sortable table
- **Reporter Dashboard**: Authenticated vote entry interface
- **Real-time Updates**: WebSocket-based live updates without page refresh
- **Dark/Light Theme**: Theme toggle with system preference detection

## Tech Stack
- **Frontend**: React, TypeScript, TanStack Query, Wouter, Tailwind CSS, Shadcn/UI
- **Backend**: Express.js, WebSocket (ws), Session-based auth
- **Data**: In-memory storage with seeded Tamil Nadu election data

## Project Structure
```
├── client/src/
│   ├── components/         # Reusable UI components
│   │   ├── tamilnadu-map.tsx    # Main state map
│   │   ├── constituency-map.tsx # District constituency view
│   │   ├── party-vote-card.tsx  # Party vote display cards
│   │   ├── round-status.tsx     # Round-wise vote panel
│   │   ├── area-status.tsx      # Area-wise vote table
│   │   ├── breadcrumbs.tsx      # Navigation breadcrumbs
│   │   ├── live-indicator.tsx   # WebSocket connection status
│   │   └── theme-toggle.tsx     # Dark/light mode toggle
│   ├── pages/
│   │   ├── dashboard.tsx        # Main election results page
│   │   ├── reporter-login.tsx   # Reporter authentication
│   │   └── reporter-dashboard.tsx # Vote entry interface
│   └── lib/
│       ├── tamilnadu-map-data.ts # Map SVG data and utilities
│       └── queryClient.ts       # TanStack Query config
├── server/
│   ├── routes.ts           # API routes + WebSocket server
│   └── storage.ts          # In-memory data storage
├── shared/
│   ├── schema.ts           # Zod schemas and TypeScript types
│   └── tamilnadu-data.ts   # Shared district/constituency data
```

## API Endpoints
- `GET /api/districts` - Get all districts with vote summaries
- `GET /api/districts/:id/constituencies` - Get constituencies for a district
- `GET /api/constituencies/:id` - Get detailed constituency results
- `GET /api/constituencies/:id/rounds` - Get counting rounds
- `POST /api/auth/login` - Reporter login
- `POST /api/auth/logout` - Reporter logout
- `GET /api/auth/me` - Get current authenticated reporter
- `POST /api/votes` - Submit votes (authenticated)

## WebSocket
- Endpoint: `/ws`
- Events:
  - `connected` - Connection established
  - `vote:update` - Real-time vote submission broadcast

## Demo Credentials
- **Reporter 1**: username: `reporter1`, password: `password123`
- **Reporter 2**: username: `reporter2`, password: `password123`
- **Admin**: username: `admin`, password: `admin123`

## Development
The application runs on port 5000 with both frontend and backend served together.
- Frontend: React with Vite dev server
- Backend: Express.js with TypeScript (tsx)

## Design Guidelines
See `design_guidelines.md` for comprehensive UI/UX specifications including:
- Typography (Inter font family)
- Color system (party colors, semantic tokens)
- Layout patterns (map + results panel)
- Component specifications
