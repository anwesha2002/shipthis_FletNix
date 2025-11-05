# FletNix - What to Watch

A modern Angular application for browsing and discovering Netflix shows.

## Features

- User authentication (login/register)
- Browse shows with pagination
- Search by title or cast
- Filter by show type (Movies/TV Shows)
- Age-restricted content
- Responsive design with Tailwind CSS
- Light/Dark mode support

## Tech Stack

- Angular 12+
- TypeScript
- Tailwind CSS
- Angular CLI
- Playwright (E2E testing)

## Prerequisites

- Node.js (v14+)
- npm (v6+)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Update `src/environments/environment.ts` for development
   - Update `src/environments/environment.prod.ts` for production

## Development

Run development server:
```bash
npm start
```

The application will be available at `http://localhost:4200`.

## Testing

Run e2e tests:
```bash
npm run e2e
```

## Build

Build for production:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── components/        # Reusable UI components
│   ├── guards/           # Route guards
│   ├── models/           # TypeScript interfaces
│   ├── pages/            # Route components
│   └── services/         # API and auth services
├── environments/         # Environment configurations
└── assets/              # Static assets
```

## API Integration

The application expects a backend API with the following endpoints:

- POST /api/v1/auth/login
- POST /api/v1/auth/register
- GET /api/v1/shows
- GET /api/v1/shows/:id

Configure the API base URL in the environment files.
