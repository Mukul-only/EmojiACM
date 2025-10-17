# TMDB Integration Setup

This application uses The Movie Database (TMDB) API to fetch real movie posters.

## Setup Instructions

### 1. Get a TMDB API Key (Free)

1. Visit [https://www.themoviedb.org](https://www.themoviedb.org)
2. Create a free account
3. Go to **Settings** → **API**
4. Click **"Create"** or **"Request an API Key"**
5. Choose **"Developer"** option
6. Fill in the required information:
   - Application Name: `Emoji Guesser` (or any name)
   - Application URL: `http://localhost:5173` (or your domain)
   - Application Summary: `A movie guessing game using emojis`
7. Accept the terms and submit
8. Copy your **API Key (v3 auth)**

### 2. Configure Your Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your API key:
   ```env
   VITE_TMDB_API_KEY=your_actual_api_key_here
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

## Features

- ✅ Automatically fetches high-quality movie posters from TMDB
- ✅ Falls back to local posters if TMDB is unavailable
- ✅ Shows a "TMDB" badge when using external posters
- ✅ Works without API key (uses fallback images)

## Troubleshooting

### Error: "TMDB API error: Invalid API key"
- Make sure you copied the correct API key from TMDB
- Ensure the key is in your `.env` file (not `.env.example`)
- Restart your development server after adding the key

### Posters not loading from TMDB
- Check browser console for error messages
- Verify your API key is valid at [TMDB API Settings](https://www.themoviedb.org/settings/api)
- The app will automatically fall back to local posters

### No API key configured
- The app will work fine without TMDB
- It will use local poster images as fallback
- You'll see a warning in the console (this is normal)

## API Usage Limits

TMDB's free tier includes:
- 40 requests per 10 seconds
- Unlimited daily requests

This is more than enough for this application's needs.

## Privacy

- No user data is sent to TMDB
- Only movie titles and years are used for searches
- All API calls are made from the client browser
