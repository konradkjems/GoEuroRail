# Interrail Planner

A web application for planning and visualizing Interrail journeys across Europe. Plan your trips, add stops, and see your route on a map.

## Features

- Create and manage multiple trips
- Add cities as stops on your journey
- Track arrival and departure dates
- Add accommodation details and notes for each stop
- Visualize your journey on an interactive map
- Store trip data locally in your browser

## Technology Stack

- **Next.js**: React framework with App Router
- **TypeScript**: For type safety
- **TailwindCSS**: For styling
- **React Hook Form**: For form management
- **Leaflet/React-Leaflet**: For interactive maps
- **date-fns**: For date handling
- **Heroicons**: For UI icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/src/app`: Next.js App Router pages
- `/src/components`: Reusable React components
- `/src/lib`: Utility functions and data
- `/src/types`: TypeScript type definitions

## Data Storage

This application uses browser localStorage to store trip data. No server or external database is required.

## License

MIT
