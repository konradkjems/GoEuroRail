# Deploying GoEuroRail to Vercel

This guide explains how to deploy the GoEuroRail application to Vercel.

## Prerequisites

- A [Vercel](https://vercel.com) account
- [Vercel CLI](https://vercel.com/docs/cli) installed (optional for CLI deployment)
- API keys for the services used by the application:
  - OpenWeatherMap
  - RapidAPI (for TripAdvisor)
  - Google Places (optional)

## Deployment Options

### 1. Deploy via GitHub Integration (Recommended)

1. Push your code to a GitHub repository
2. Log in to [Vercel](https://vercel.com)
3. Click "New Project" and import your repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next
5. Add environment variables (see below)
6. Click "Deploy"

### 2. Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from the project directory:
   ```bash
   vercel
   ```

   Follow the on-screen prompts to configure your project.

4. For production deployment:
   ```bash
   vercel --prod
   ```

## Environment Variables

Set these environment variables in your Vercel project settings:

```
# API Keys
NEXT_PUBLIC_OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
NEXT_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key
NEXT_PUBLIC_GOOGLEPLACES_API_KEY=your_googleplaces_api_key

# API URLs
NEXT_PUBLIC_OPENWEATHERMAP_BASE_URL=https://api.openweathermap.org/data/2.5
NEXT_PUBLIC_RAPIDAPI_HOST=tripadvisor16.p.rapidapi.com
NEXT_PUBLIC_GOOGLEPLACES_BASE_URL=https://maps.googleapis.com/maps/api/place

# Cache Settings
NEXT_PUBLIC_CACHE_TTL_WEATHER=3600
NEXT_PUBLIC_CACHE_TTL_BUDGET=604800
NEXT_PUBLIC_CACHE_TTL_ATTRACTIONS=86400
NEXT_PUBLIC_CACHE_TTL_ACCOMMODATIONS=86400

# App Settings
NEXT_PUBLIC_DEFAULT_LANGUAGE=en
NEXT_PUBLIC_DEFAULT_CURRENCY=EUR
NEXT_PUBLIC_ENABLE_MOCK_DATA=true
```

## Vercel Configuration

The project includes a `vercel.json` file with appropriate settings for:
- Region configuration (Frankfurt)
- Headers for optimal caching
- Rewrite rules for data files

## Data Files

The application uses a cost of living dataset stored in `public/data/cost_of_living.csv`. This file is accessible through a URL path after deployment.

## Monitoring and Logs

After deployment:
1. Go to your project dashboard on Vercel
2. Check the "Deployments" tab for build status
3. Use the "Logs" section to debug any issues
4. Monitor performance in the "Analytics" section

## Troubleshooting

- **Build Errors**: Check build logs for missing dependencies or configuration issues
- **API Errors**: Verify your environment variables are set correctly
- **Data Loading Issues**: Ensure data files are properly deployed in the public directory
- **CORS Issues**: Use Vercel's Headers configuration to set appropriate CORS headers if needed

## Production Considerations

1. Set `NEXT_PUBLIC_ENABLE_MOCK_DATA=false` in production
2. Enable environment variable encryption for API keys
3. Consider setting up preview deployments for branches
4. Use Vercel Analytics to monitor performance
5. Consider custom domain setup for production use 