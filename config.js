// Configuration file for API keys
// Replace with your actual API keys

const CONFIG = {
    // Google Places API key - get from https://console.cloud.google.com/
    GOOGLE_PLACES_API_KEY: 'YOUR_GOOGLE_PLACES_API_KEY_HERE',
    
    // Optional: Yelp API key for additional restaurant data
    YELP_API_KEY: 'YOUR_YELP_API_KEY_HERE',
    
    // Search radius in meters (default: 5000m = ~3 miles)
    SEARCH_RADIUS: 5000,
    
    // Maximum number of results to fetch
    MAX_RESULTS: 20
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
