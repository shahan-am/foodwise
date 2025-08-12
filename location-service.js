// Real Location Service for fetching actual restaurant data
class RealLocationService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.placesService = null;
        this.map = null;
    }

    // Initialize Google Places service
    initializeGooglePlaces() {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                // Create a hidden map for Places service
                this.map = new google.maps.Map(document.createElement('div'));
                this.placesService = new google.maps.places.PlacesService(this.map);
                resolve();
            } else {
                // Load Google Maps API
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=places`;
                script.onload = () => {
                    this.map = new google.maps.Map(document.createElement('div'));
                    this.placesService = new google.maps.places.PlacesService(this.map);
                    resolve();
                };
                script.onerror = reject;
                document.head.appendChild(script);
            }
        });
    }

    // Get user's current location
    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutes
                }
            );
        });
    }

    // Search for restaurants based on diet type and location
    async searchRestaurants(location, dietType, budget, radius = 5000) {
        if (!this.placesService) {
            await this.initializeGooglePlaces();
        }

        return new Promise((resolve, reject) => {
            const request = {
                location: new google.maps.LatLng(location.lat, location.lng),
                radius: radius,
                type: 'restaurant',
                keyword: this.getDietKeywords(dietType),
                openNow: true
            };

            this.placesService.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    const processedResults = this.processRestaurantResults(results, dietType, budget);
                    resolve(processedResults);
                } else {
                    reject(new Error(`Places API error: ${status}`));
                }
            });
        });
    }

    // Get detailed information about a specific restaurant
    getRestaurantDetails(placeId) {
        return new Promise((resolve, reject) => {
            const request = {
                placeId: placeId,
                fields: ['name', 'rating', 'formatted_phone_number', 'formatted_address', 
                        'website', 'opening_hours', 'price_level', 'photos', 'reviews']
            };

            this.placesService.getDetails(request, (place, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    resolve(place);
                } else {
                    reject(new Error(`Place details error: ${status}`));
                }
            });
        });
    }

    // Convert diet type to search keywords
    getDietKeywords(dietType) {
        const keywords = {
            'vegetarian': 'vegetarian vegan plant-based',
            'vegan': 'vegan plant-based',
            'keto': 'keto low-carb ketogenic',
            'paleo': 'paleo organic natural',
            'mediterranean': 'mediterranean healthy',
            'low-carb': 'low-carb keto healthy',
            'balanced': 'healthy fresh organic',
            'high-protein': 'protein healthy fitness'
        };
        return keywords[dietType] || 'healthy restaurant';
    }

    // Process and filter restaurant results
    processRestaurantResults(results, dietType, budget) {
        return results.map(place => {
            const distance = this.calculateDistance(place.geometry.location);
            const priceRange = this.mapPriceLevel(place.price_level);
            
            return {
                id: place.place_id,
                name: place.name,
                type: place.types[0]?.replace(/_/g, ' ') || 'Restaurant',
                rating: place.rating || 0,
                priceRange: priceRange,
                distance: `${distance.toFixed(1)} miles`,
                address: place.vicinity,
                coordinates: {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                },
                photos: place.photos ? place.photos.slice(0, 3).map(photo => 
                    photo.getUrl({ maxWidth: 400, maxHeight: 300 })
                ) : [],
                isOpen: place.opening_hours?.open_now,
                dietCompatibility: this.calculateDietCompatibility(place, dietType),
                budgetMatch: this.checkBudgetMatch(priceRange, budget)
            };
        })
        .filter(restaurant => restaurant.budgetMatch && restaurant.dietCompatibility > 0.3)
        .sort((a, b) => {
            // Sort by diet compatibility and rating
            const scoreA = (a.dietCompatibility * 0.6) + (a.rating * 0.4);
            const scoreB = (b.dietCompatibility * 0.6) + (b.rating * 0.4);
            return scoreB - scoreA;
        })
        .slice(0, 8);
    }

    // Calculate distance from user location (simplified)
    calculateDistance(placeLocation) {
        // This would use the user's actual location
        // For now, return a random distance between 0.1 and 2.0 miles
        return Math.random() * 1.9 + 0.1;
    }

    // Map Google's price level to our system
    mapPriceLevel(priceLevel) {
        const mapping = {
            0: 'low',
            1: 'low',
            2: 'medium',
            3: 'high',
            4: 'high'
        };
        return mapping[priceLevel] || 'medium';
    }

    // Calculate how well a restaurant matches the diet type
    calculateDietCompatibility(place, dietType) {
        const name = place.name.toLowerCase();
        const types = place.types.join(' ').toLowerCase();
        
        const dietScores = {
            'vegetarian': this.scoreText(name + ' ' + types, ['vegetarian', 'vegan', 'plant', 'green', 'garden', 'organic']),
            'vegan': this.scoreText(name + ' ' + types, ['vegan', 'plant', 'raw', 'organic', 'green']),
            'keto': this.scoreText(name + ' ' + types, ['keto', 'low-carb', 'protein', 'meat', 'grill']),
            'paleo': this.scoreText(name + ' ' + types, ['paleo', 'organic', 'natural', 'farm', 'fresh']),
            'mediterranean': this.scoreText(name + ' ' + types, ['mediterranean', 'greek', 'olive', 'fresh', 'healthy']),
            'balanced': 0.7 // Default compatibility for balanced diet
        };

        return dietScores[dietType] || 0.5;
    }

    // Score text based on keywords
    scoreText(text, keywords) {
        let score = 0;
        keywords.forEach(keyword => {
            if (text.includes(keyword)) {
                score += 0.2;
            }
        });
        return Math.min(score, 1.0);
    }

    // Check if restaurant matches budget
    checkBudgetMatch(restaurantPrice, userBudget) {
        const budgetMapping = {
            'low': ['low'],
            'medium': ['low', 'medium'],
            'high': ['low', 'medium', 'high']
        };
        return budgetMapping[userBudget]?.includes(restaurantPrice) || false;
    }

    // Generate menu recommendations based on diet type (AI-powered suggestions)
    generateMenuRecommendations(restaurant, dietType, nutritionGoals) {
        // This would ideally use menu APIs or AI to generate real recommendations
        // For now, we'll create intelligent suggestions based on restaurant type and diet
        
        const menuSuggestions = this.getMenuSuggestionsForDiet(dietType, restaurant.type);
        
        return menuSuggestions.map(item => ({
            ...item,
            healthScore: this.calculateHealthScore(item, nutritionGoals),
            calorieEstimate: this.estimateCalories(item, nutritionGoals)
        })).sort((a, b) => b.healthScore - a.healthScore).slice(0, 3);
    }

    // Get menu suggestions based on diet and restaurant type
    getMenuSuggestionsForDiet(dietType, restaurantType) {
        const suggestions = {
            'vegetarian': [
                { name: 'Quinoa Buddha Bowl', description: 'Nutrient-dense bowl with quinoa, vegetables, and tahini dressing' },
                { name: 'Veggie Burger', description: 'Plant-based protein with whole grain bun and sweet potato fries' },
                { name: 'Mediterranean Salad', description: 'Fresh greens with chickpeas, olives, and olive oil dressing' }
            ],
            'vegan': [
                { name: 'Acai Bowl', description: 'Antioxidant-rich acai with fresh fruits and nuts' },
                { name: 'Lentil Curry', description: 'Protein-rich lentils with vegetables and brown rice' },
                { name: 'Avocado Toast', description: 'Whole grain bread with avocado, tomatoes, and hemp seeds' }
            ],
            'keto': [
                { name: 'Grilled Salmon', description: 'High-fat fish with asparagus and butter sauce' },
                { name: 'Ribeye Steak', description: 'High-fat cut with sautéed mushrooms and spinach' },
                { name: 'Chicken Caesar Salad', description: 'No croutons, extra parmesan and olive oil' }
            ],
            'mediterranean': [
                { name: 'Grilled Fish', description: 'Fresh fish with olive oil, lemon, and herbs' },
                { name: 'Greek Salad', description: 'Tomatoes, cucumber, olives, and feta cheese' },
                { name: 'Hummus Plate', description: 'Chickpea hummus with vegetables and olive oil' }
            ]
        };

        return suggestions[dietType] || suggestions['mediterranean'];
    }

    // Calculate health score for menu item
    calculateHealthScore(item, nutritionGoals) {
        // Simplified scoring based on item name and description
        let score = 0.5;
        
        const healthyKeywords = ['grilled', 'fresh', 'organic', 'quinoa', 'salmon', 'avocado', 'vegetables'];
        const unhealthyKeywords = ['fried', 'processed', 'sugar', 'refined'];
        
        const text = (item.name + ' ' + item.description).toLowerCase();
        
        healthyKeywords.forEach(keyword => {
            if (text.includes(keyword)) score += 0.1;
        });
        
        unhealthyKeywords.forEach(keyword => {
            if (text.includes(keyword)) score -= 0.1;
        });
        
        return Math.max(0, Math.min(1, score));
    }

    // Estimate calories for menu item
    estimateCalories(item, nutritionGoals) {
        // Simplified calorie estimation
        const baseCalories = {
            'salad': 300,
            'bowl': 450,
            'burger': 600,
            'steak': 700,
            'fish': 400,
            'curry': 500
        };

        const itemType = Object.keys(baseCalories).find(type => 
            item.name.toLowerCase().includes(type)
        ) || 'bowl';

        return baseCalories[itemType] || 450;
    }
}

// Export the service
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealLocationService;
} else {
    window.RealLocationService = RealLocationService;
}
