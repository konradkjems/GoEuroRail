# GoEuroRail - European Rail Travel Assistant

GoEuroRail is a comprehensive web application designed to help travelers plan their European rail journeys. It provides weather forecasts, budget estimations, train pass recommendations, attraction suggestions, and accommodation options.

## Features

- **Smart Trip Assistant**: Get personalized recommendations based on your itinerary
- **Interactive Map**: Visualize your trip across Europe
- **Weather Forecasts**: Plan for weather conditions at each destination
- **Budget Estimation**: Calculate your trip costs based on real-time cost of living data
- **Train Pass Calculator**: Find the most cost-effective rail pass options
- **Attraction Recommendations**: Discover popular sights and activities at each stop
- **Bookable Activities**: Book tours and activities through GetYourGuide integration
- **Accommodation Suggestions**: Find lodging options that match your budget and preferences

## Tech Stack

- Next.js 14
- TypeScript
- React
- Tailwind CSS
- Leaflet for mapping
- MongoDB for data storage
- GetYourGuide Partner API for activities

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (optional, for data storage)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/goeurorail.git
cd goeurorail
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```
Then edit `.env.local` with your API keys and configuration.

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

The application is optimized for deployment on Vercel:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

Alternatively, connect your GitHub repository to Vercel for automatic deployments.

### Environment Variables

Ensure you set the following environment variables in your Vercel project:

- `NEXT_PUBLIC_OPENWEATHERMAP_API_KEY`: For weather forecasts
- `NEXT_PUBLIC_RAPIDAPI_KEY`: For TripAdvisor data
- `NEXT_PUBLIC_GETYOURGUIDE_PARTNER_ID`: For bookable activities
- `MONGODB_URI` (optional): For database connection

## Data Sources

- Weather data: OpenWeatherMap API
- Attraction data: TripAdvisor API
- Cost of living data: Local database
- Activities and tours: GetYourGuide

## Hotel APIs Configuration

This application uses hotel APIs to fetch real accommodation data. You can configure which API to use in the `.env.local` file.

### Available Providers

#### 1. RapidAPI Hotels (Default)
This provider requires an API key from RapidAPI. To use this provider:

1. Sign up at [RapidAPI](https://rapidapi.com/)
2. Subscribe to the [Hotels API](https://rapidapi.com/apidojo/api/hotels4) 
3. Add your API key to the `.env.local` file:

```
NEXT_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key
NEXT_PUBLIC_RAPIDAPI_HOST=hotels4.p.rapidapi.com
```

#### 2. MakCorps Hotel API (Fallback)
This provider offers a free plan with limited calls. To use this provider:

1. Sign up at [MakCorps](https://makcorps.com/)
2. Get your API key
3. Add your API key to the `.env.local` file:

```
NEXT_PUBLIC_MAKCORPS_API_KEY=your_makcorps_api_key
```

The app will first try to use MakCorps API and fall back to the mock data if that fails.

### Creating `.env.local` file

Create a `.env.local` file in the root directory with the following content:

```
# RapidAPI credentials
NEXT_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key
NEXT_PUBLIC_RAPIDAPI_HOST=hotels4.p.rapidapi.com

# MakCorps API key
NEXT_PUBLIC_MAKCORPS_API_KEY=free_demo

# Cache settings
CACHE_TTL_HOTELS=3600 # 1 hour
```

Replace `your_rapidapi_key` and `free_demo` with your actual API keys.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Data sources and API providers
- The Next.js and React communities for their excellent documentation
- European rail networks for inspiring this application
