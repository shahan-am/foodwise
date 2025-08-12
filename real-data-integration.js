// Integration script to replace mocked data with real location-based data

class RealDataIntegration {
    constructor(foodWiseApp) {
        this.app = foodWiseApp;
        this.locationService = null;
        this.isRealDataEnabled = false;
    }

    // Initialize real data services
    async initialize(googleApiKey) {
        try {
            this.locationService = new RealLocationService(googleApiKey);
            await this.locationService.initializeGooglePlaces();
            this.isRealDataEnabled = true;
            console.log('Real data integration initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize real data integration:', error);
            this.isRealDataEnabled = false;
            return false;
        }
    }

    // Override the findNearbyLocations method to use real data
    async findNearbyLocationsReal() {
        if (!this.isRealDataEnabled || !this.app.userLocation) {
            return this.app.findNearbyLocations(); // Fall back to mock data
        }

        try {
            const { dietType, budget } = this.app.userProfile;
            
            // Get real restaurants from Google Places
            const realRestaurants = await this.locationService.searchRestaurants(
                this.app.userLocation,
                dietType,
                budget,
                CONFIG.SEARCH_RADIUS
            );

            // Enhance with menu recommendations
            const enhancedRestaurants = await Promise.all(
                realRestaurants.map(async (restaurant) => {
                    try {
                        // Get detailed restaurant info
                        const details = await this.locationService.getRestaurantDetails(restaurant.id);
                        
                        // Generate menu recommendations
                        const menuRecommendations = this.locationService.generateMenuRecommendations(
                            restaurant,
                            dietType,
                            this.app.userProfile.nutritionGoals
                        );

                        return {
                            ...restaurant,
                            phone: details.formatted_phone_number || 'N/A',
                            website: details.website || null,
                            openingHours: details.opening_hours?.weekday_text || [],
                            reviews: details.reviews?.slice(0, 3) || [],
                            menuRecommendations: menuRecommendations,
                            googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.name)}&query_place_id=${restaurant.id}`
                        };
                    } catch (error) {
                        console.warn(`Failed to get details for ${restaurant.name}:`, error);
                        return {
                            ...restaurant,
                            menuRecommendations: this.locationService.generateMenuRecommendations(
                                restaurant,
                                dietType,
                                this.app.userProfile.nutritionGoals
                            )
                        };
                    }
                })
            );

            // Update the app's nearby locations
            this.app.nearbyLocations = enhancedRestaurants;
            return enhancedRestaurants;

        } catch (error) {
            console.error('Error fetching real restaurant data:', error);
            // Fall back to mock data
            return this.app.findNearbyLocations();
        }
    }

    // Enhanced location display with real data
    displayRealLocations() {
        const container = document.getElementById('nearbyLocations');
        
        if (!this.app.nearbyLocations || this.app.nearbyLocations.length === 0) {
            container.innerHTML = `
                <div class="no-locations">
                    <i class="fas fa-search"></i>
                    <p>No restaurants found matching your criteria. Try adjusting your diet type or budget preferences.</p>
                </div>
            `;
            return;
        }

        const locationsHTML = this.app.nearbyLocations.map(location => `
            <div class="location-card ${this.isRealDataEnabled ? 'real-data' : 'demo-data'}">
                <div class="location-header">
                    <div class="location-info">
                        <h3>${location.name}</h3>
                        <p class="location-type">${location.type}</p>
                        <div class="location-meta">
                            <span class="distance">
                                <i class="fas fa-map-marker-alt"></i> ${location.distance}
                            </span>
                            <span class="rating">
                                <i class="fas fa-star"></i> ${location.rating.toFixed(1)}
                            </span>
                            <span class="price-range ${location.priceRange}">
                                ${this.getPriceSymbols(location.priceRange)}
                            </span>
                            ${location.isOpen !== undefined ? 
                                `<span class="open-status ${location.isOpen ? 'open' : 'closed'}">
                                    <i class="fas fa-clock"></i> ${location.isOpen ? 'Open' : 'Closed'}
                                </span>` : ''
                            }
                        </div>
                    </div>
                    ${this.isRealDataEnabled ? 
                        `<div class="real-data-badge">
                            <i class="fas fa-check-circle"></i> Live Data
                        </div>` : 
                        `<div class="demo-data-badge">
                            <i class="fas fa-flask"></i> Demo
                        </div>`
                    }
                </div>
                
                <div class="location-details">
                    <p class="address">
                        <i class="fas fa-map-marker-alt"></i> ${location.address}
                    </p>
                    ${location.phone && location.phone !== 'N/A' ? 
                        `<p class="phone">
                            <i class="fas fa-phone"></i> ${location.phone}
                        </p>` : ''
                    }
                    ${location.website ? 
                        `<p class="website">
                            <i class="fas fa-globe"></i> 
                            <a href="${location.website}" target="_blank">Visit Website</a>
                        </p>` : ''
                    }
                </div>

                ${location.menuRecommendations && location.menuRecommendations.length > 0 ? `
                    <div class="menu-recommendations">
                        <h4><i class="fas fa-utensils"></i> Recommended for You</h4>
                        <div class="recommended-dishes">
                            ${location.menuRecommendations.map(dish => `
                                <div class="dish-recommendation">
                                    <div class="dish-info">
                                        <h5>${dish.name}</h5>
                                        <p>${dish.description}</p>
                                        <div class="dish-meta">
                                            <span class="calories">~${dish.calorieEstimate} cal</span>
                                            <span class="health-score">
                                                <i class="fas fa-heart"></i> ${(dish.healthScore * 100).toFixed(0)}% match
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                ${location.reviews && location.reviews.length > 0 ? `
                    <div class="recent-reviews">
                        <h4><i class="fas fa-comments"></i> Recent Reviews</h4>
                        ${location.reviews.slice(0, 2).map(review => `
                            <div class="review">
                                <div class="review-rating">
                                    ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
                                </div>
                                <p>"${review.text.substring(0, 100)}${review.text.length > 100 ? '...' : ''}"</p>
                                <small>- ${review.author_name}</small>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <div class="location-actions">
                    <a href="${location.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name + ' ' + location.address)}`}" 
                       target="_blank" class="maps-link">
                        <i class="fas fa-directions"></i> Get Directions
                    </a>
                    ${location.phone && location.phone !== 'N/A' ? 
                        `<a href="tel:${location.phone}" class="call-link">
                            <i class="fas fa-phone"></i> Call
                        </a>` : ''
                    }
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="locations-header">
                <h3>
                    <i class="fas fa-map-marker-alt"></i> 
                    ${this.isRealDataEnabled ? 'Nearby Restaurants' : 'Demo Restaurants'} 
                    (${this.app.nearbyLocations.length})
                </h3>
                ${this.isRealDataEnabled ? 
                    '<p class="real-data-notice"><i class="fas fa-satellite-dish"></i> Showing real restaurants near your location</p>' :
                    '<p class="demo-data-notice"><i class="fas fa-info-circle"></i> Demo data - Enable real location data by adding your Google Places API key</p>'
                }
            </div>
            <div class="locations-grid">
                ${locationsHTML}
            </div>
        `;
    }

    // Get price symbols for display
    getPriceSymbols(priceRange) {
        const symbols = {
            'low': '$',
            'medium': '$$',
            'high': '$$$'
        };
        return symbols[priceRange] || '$$';
    }

    // Setup method to integrate with existing app
    setupRealDataIntegration() {
        // Override the original methods
        this.app.findNearbyLocationsOriginal = this.app.findNearbyLocations.bind(this.app);
        this.app.findNearbyLocations = this.findNearbyLocationsReal.bind(this);
        
        this.app.displayLocationsOriginal = this.app.displayLocations.bind(this.app);
        this.app.displayLocations = this.displayRealLocations.bind(this);

        // Add API key configuration UI
        this.addApiKeyConfiguration();
    }

    // Add UI for API key configuration
    addApiKeyConfiguration() {
        const settingsSection = document.createElement('div');
        settingsSection.className = 'api-settings';
        settingsSection.innerHTML = `
            <div class="api-config-section">
                <h3><i class="fas fa-cog"></i> Real Data Configuration</h3>
                <div class="api-key-input">
                    <label for="googleApiKey">Google Places API Key:</label>
                    <input type="password" id="googleApiKey" placeholder="Enter your Google Places API key">
                    <button onclick="realDataIntegration.enableRealData()" class="enable-real-data-btn">
                        <i class="fas fa-satellite-dish"></i> Enable Real Data
                    </button>
                </div>
                <div class="api-instructions">
                    <p><i class="fas fa-info-circle"></i> To get real restaurant data:</p>
                    <ol>
                        <li>Go to <a href="https://console.cloud.google.com/" target="_blank">Google Cloud Console</a></li>
                        <li>Enable the Places API</li>
                        <li>Create an API key</li>
                        <li>Enter the key above and click "Enable Real Data"</li>
                    </ol>
                </div>
            </div>
        `;

        // Insert before the form
        const form = document.querySelector('.profile-form');
        form.parentNode.insertBefore(settingsSection, form);
    }

    // Method to enable real data with API key
    async enableRealData() {
        const apiKeyInput = document.getElementById('googleApiKey');
        const apiKey = apiKeyInput.value.trim();

        if (!apiKey) {
            alert('Please enter your Google Places API key');
            return;
        }

        const button = document.querySelector('.enable-real-data-btn');
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Initializing...';
        button.disabled = true;

        try {
            const success = await this.initialize(apiKey);
            if (success) {
                button.innerHTML = '<i class="fas fa-check"></i> Real Data Enabled';
                button.className = 'enable-real-data-btn enabled';
                
                // Refresh recommendations if user has already filled the form
                if (this.app.userProfile.weight) {
                    await this.app.generateRecommendations();
                }
                
                alert('Real data integration enabled! Your recommendations will now use live restaurant data.');
            } else {
                throw new Error('Failed to initialize real data integration');
            }
        } catch (error) {
            console.error('Error enabling real data:', error);
            button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error - Try Again';
            button.disabled = false;
            alert('Failed to enable real data. Please check your API key and try again.');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for the main app to be initialized
    setTimeout(() => {
        if (window.foodWise) {
            window.realDataIntegration = new RealDataIntegration(window.foodWise);
            window.realDataIntegration.setupRealDataIntegration();
        }
    }, 1000);
});
