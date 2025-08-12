# Real Data Integration Setup Guide

This guide will help you set up real location-based restaurant data for the FoodWise application.

## Overview

The enhanced FoodWise application now supports fetching real restaurant data based on your actual location using Google Places API. This replaces the demo/mock data with live information about nearby restaurants.

## Features Added

### 🌍 Real Location Data
- **Live Restaurant Search**: Fetches actual restaurants near your location
- **Google Places Integration**: Uses Google's comprehensive restaurant database
- **Real-time Information**: Shows current ratings, hours, and contact info
- **Accurate Distances**: Calculates actual distances from your location

### 🍽️ Smart Menu Recommendations
- **Diet-Specific Suggestions**: AI-powered menu recommendations based on your diet
- **Nutritional Estimates**: Calorie and health score estimates for dishes
- **Popular Items**: Highlights trending and highly-rated menu items

### ⭐ Enhanced Restaurant Details
- **Live Reviews**: Shows recent Google reviews
- **Operating Hours**: Real-time open/closed status
- **Contact Information**: Phone numbers and websites
- **Photos**: Restaurant photos from Google Places

## Setup Instructions

### Step 1: Get Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Places API**
   - **Maps JavaScript API** (optional, for enhanced maps)
4. Go to "Credentials" and create an API key
5. (Recommended) Restrict the API key to your domain for security

### Step 2: Configure the Application

1. Open the FoodWise application in your browser
2. Look for the "Real Data Configuration" section at the top
3. Enter your Google Places API key in the input field
4. Click "Enable Real Data"
5. Allow location access when prompted by your browser

### Step 3: Test the Integration

1. Fill out your profile information (weight, height, diet type, etc.)
2. Click "Get My Location" to enable location services
3. Click "Get Food Recommendations"
4. You should now see real restaurants near your location with live data

## API Key Security

### Important Security Notes:
- **Never commit API keys to public repositories**
- **Restrict API keys to your domain**
- **Monitor API usage in Google Cloud Console**
- **Set up billing alerts to avoid unexpected charges**

### API Key Restrictions (Recommended):
1. In Google Cloud Console, go to your API key
2. Under "Application restrictions", select "HTTP referrers"
3. Add your domain (e.g., `yourdomain.com/*`)
4. Under "API restrictions", select "Restrict key"
5. Choose "Places API" and "Maps JavaScript API"

## Fallback Behavior

The application is designed to gracefully handle API failures:

- **No API Key**: Shows demo data with clear indicators
- **API Errors**: Falls back to mock data automatically
- **Location Denied**: Uses demo locations but shows real data structure
- **Network Issues**: Displays cached data or demo alternatives

## Cost Considerations

### Google Places API Pricing:
- **Nearby Search**: $32 per 1,000 requests
- **Place Details**: $17 per 1,000 requests
- **Free Tier**: $200 monthly credit (covers ~6,000 searches)

### Optimization Features:
- **Caching**: Results are cached to reduce API calls
- **Batch Requests**: Multiple details fetched efficiently
- **Smart Filtering**: Only fetches details for relevant restaurants

## Troubleshooting

### Common Issues:

1. **"Failed to enable real data"**
   - Check if API key is valid
   - Ensure Places API is enabled
   - Verify billing is set up in Google Cloud

2. **"No restaurants found"**
   - Try adjusting diet type or budget filters
   - Check if location services are enabled
   - Verify you're in an area with restaurants

3. **Demo data still showing**
   - Refresh the page after enabling real data
   - Check browser console for error messages
   - Ensure API key has proper permissions

### Debug Mode:
Open browser developer tools (F12) and check the console for detailed error messages.

## File Structure

```
foodwise/
├── config.js                    # API configuration
├── location-service.js          # Google Places integration
├── real-data-integration.js     # Integration with main app
├── real-data-styles.css         # Styles for real data features
├── index.html                   # Updated with new scripts
├── script.js                    # Original app (unchanged)
└── styles.css                   # Original styles (unchanged)
```

## Development Notes

### Extending the Integration:
- **Add more APIs**: Yelp, Foursquare, etc.
- **Menu APIs**: Integrate with restaurant menu services
- **Nutrition APIs**: Get detailed nutritional information
- **Reservation Systems**: Add booking capabilities

### Customization:
- **Search Radius**: Modify `SEARCH_RADIUS` in config.js
- **Result Limits**: Adjust `MAX_RESULTS` in config.js
- **Diet Keywords**: Enhance diet-to-keyword mapping
- **Scoring Algorithms**: Improve restaurant and dish scoring

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify API key setup in Google Cloud Console
3. Test with a simple location first
4. Check network connectivity and CORS settings

## Future Enhancements

Planned improvements:
- **Real Menu Data**: Integration with menu APIs
- **Nutritional Analysis**: Detailed macro/micro nutrient data
- **User Reviews**: Allow users to rate and review
- **Meal Planning**: Save and plan meals from recommendations
- **Social Features**: Share recommendations with friends

---

**Note**: This integration transforms FoodWise from a demo application into a fully functional restaurant discovery tool with real-world data!
