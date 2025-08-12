// FoodWise Application JavaScript

class FoodWise {
    constructor() {
        this.userLocation = null;
        this.userProfile = {};
        this.initializeApp();
    }

    initializeApp() {
        this.bindEvents();
        this.loadFoodDatabase();
    }

    bindEvents() {
        // Get location button
        document.getElementById('getLocation').addEventListener('click', () => {
            this.getCurrentLocation();
        });

        // Form submission
        document.getElementById('foodForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });
    }

    // Geolocation functionality
    getCurrentLocation() {
        const locationBtn = document.getElementById('getLocation');
        const locationStatus = document.getElementById('locationStatus');
        
        locationBtn.innerHTML = '<div class="loading"></div> Getting Location...';
        locationBtn.disabled = true;

        if (!navigator.geolocation) {
            this.showLocationError('Geolocation is not supported by this browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                
                locationStatus.innerHTML = `<i class="fas fa-check-circle"></i> Location found successfully!`;
                locationStatus.className = 'location-status success';
                
                locationBtn.innerHTML = '<i class="fas fa-check"></i> Location Found';
                locationBtn.style.background = '#28a745';
            },
            (error) => {
                let errorMessage = 'Unable to retrieve location.';
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied by user.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out.';
                        break;
                }
                this.showLocationError(errorMessage);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    }

    showLocationError(message) {
        const locationBtn = document.getElementById('getLocation');
        const locationStatus = document.getElementById('locationStatus');
        
        locationStatus.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        locationStatus.className = 'location-status error';
        
        locationBtn.innerHTML = '<i class="fas fa-crosshairs"></i> Try Again';
        locationBtn.disabled = false;
        locationBtn.style.background = '';
    }

    // Form handling
    handleFormSubmission() {
        this.collectUserData();
        this.calculateNutritionGoals();
        this.generateFoodRecommendations();
        this.findNearbyLocations();
        this.displayResults();
    }

    collectUserData() {
        const formData = new FormData(document.getElementById('foodForm'));
        
        this.userProfile = {
            weight: parseInt(formData.get('weight')),
            height: parseInt(formData.get('height')),
            age: parseInt(formData.get('age')),
            gender: formData.get('gender'),
            dietType: formData.get('dietType'),
            fitnessGoal: formData.get('fitnessGoal'),
            activityLevel: formData.get('activityLevel'),
            budget: formData.get('budget'),
            allergies: formData.getAll('allergies')
        };
    }

    // Calculate BMR and daily calorie needs
    calculateNutritionGoals() {
        const { weight, height, age, gender, activityLevel, fitnessGoal } = this.userProfile;
        
        // Calculate BMR using Mifflin-St Jeor Equation
        let bmr;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        // Activity multipliers
        const activityMultipliers = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'active': 1.725,
            'very-active': 1.9
        };

        let dailyCalories = bmr * activityMultipliers[activityLevel];

        // Adjust based on fitness goal
        switch (fitnessGoal) {
            case 'weight-loss':
                dailyCalories -= 500; // 500 calorie deficit
                break;
            case 'weight-gain':
                dailyCalories += 500; // 500 calorie surplus
                break;
            case 'muscle-gain':
                dailyCalories += 300; // Moderate surplus
                break;
        }

        // Calculate macronutrients based on diet type
        const macros = this.calculateMacros(dailyCalories, this.userProfile.dietType);

        this.userProfile.nutritionGoals = {
            calories: Math.round(dailyCalories),
            protein: Math.round(macros.protein),
            carbs: Math.round(macros.carbs),
            fat: Math.round(macros.fat),
            fiber: Math.round(dailyCalories / 1000 * 14), // 14g per 1000 calories
            water: Math.round(weight * 35) // 35ml per kg body weight
        };
    }

    calculateMacros(calories, dietType) {
        let proteinPercent, carbPercent, fatPercent;

        switch (dietType) {
            case 'keto':
                proteinPercent = 0.25;
                carbPercent = 0.05;
                fatPercent = 0.70;
                break;
            case 'high-protein':
                proteinPercent = 0.35;
                carbPercent = 0.35;
                fatPercent = 0.30;
                break;
            case 'low-carb':
                proteinPercent = 0.30;
                carbPercent = 0.20;
                fatPercent = 0.50;
                break;
            default: // balanced, vegetarian, vegan, paleo, mediterranean
                proteinPercent = 0.25;
                carbPercent = 0.45;
                fatPercent = 0.30;
        }

        return {
            protein: (calories * proteinPercent) / 4, // 4 calories per gram
            carbs: (calories * carbPercent) / 4,
            fat: (calories * fatPercent) / 9 // 9 calories per gram
        };
    }

    // Food recommendation system
    generateFoodRecommendations() {
        const { dietType, fitnessGoal, allergies } = this.userProfile;
        
        let recommendations = [];
        
        // Filter foods based on diet type and allergies
        const suitableFoods = this.foodDatabase.filter(food => {
            // Check diet compatibility
            if (!food.dietTypes.includes(dietType) && !food.dietTypes.includes('all')) {
                return false;
            }
            
            // Check allergies
            if (allergies.some(allergy => food.allergens.includes(allergy))) {
                return false;
            }
            
            return true;
        });

        // Prioritize foods based on fitness goal
        const goalPriority = {
            'weight-loss': ['low-calorie', 'high-fiber', 'high-protein'],
            'weight-gain': ['high-calorie', 'healthy-fats', 'complex-carbs'],
            'muscle-gain': ['high-protein', 'complex-carbs', 'healthy-fats'],
            'maintenance': ['balanced', 'nutrient-dense'],
            'endurance': ['complex-carbs', 'antioxidants', 'electrolytes']
        };

        const priorities = goalPriority[fitnessGoal] || ['balanced'];
        
        // Score and sort foods
        suitableFoods.forEach(food => {
            let score = 0;
            priorities.forEach((priority, index) => {
                if (food.benefits.includes(priority)) {
                    score += (priorities.length - index) * 10;
                }
            });
            food.score = score;
        });

        // Get top recommendations
        recommendations = suitableFoods
            .sort((a, b) => b.score - a.score)
            .slice(0, 8);

        this.userProfile.recommendations = recommendations;
    }

    // Find nearby restaurants/locations
    findNearbyLocations() {
        const { dietType, budget } = this.userProfile;
        
        // Generate realistic nearby locations with coordinates
        const mockLocations = [
            {
                name: "Green Garden Cafe",
                type: "Vegetarian Restaurant",
                distance: "0.3 miles",
                rating: 4.5,
                priceRange: "medium",
                dietTypes: ["vegetarian", "vegan", "balanced"],
                address: "123 Health Street, Downtown",
                phone: "(555) 123-4567",
                coordinates: this.generateNearbyCoordinates(0.3)
            },
            {
                name: "Protein Palace",
                type: "Health Food Store",
                distance: "0.5 miles",
                rating: 4.2,
                priceRange: "high",
                dietTypes: ["high-protein", "keto", "paleo"],
                address: "456 Fitness Ave, City Center",
                phone: "(555) 234-5678",
                coordinates: this.generateNearbyCoordinates(0.5)
            },
            {
                name: "Mediterranean Delights",
                type: "Mediterranean Restaurant",
                distance: "0.7 miles",
                rating: 4.7,
                priceRange: "medium",
                dietTypes: ["mediterranean", "balanced"],
                address: "789 Olive Branch Rd, Midtown",
                phone: "(555) 345-6789",
                coordinates: this.generateNearbyCoordinates(0.7)
            },
            {
                name: "Keto Kitchen",
                type: "Specialty Restaurant",
                distance: "0.8 miles",
                rating: 4.3,
                priceRange: "high",
                dietTypes: ["keto", "low-carb"],
                address: "321 Low Carb Lane, Uptown",
                phone: "(555) 456-7890",
                coordinates: this.generateNearbyCoordinates(0.8)
            },
            {
                name: "Fresh Market",
                type: "Grocery Store",
                distance: "1.2 miles",
                rating: 4.0,
                priceRange: "low",
                dietTypes: ["all"],
                address: "654 Market Square, Shopping District",
                phone: "(555) 567-8901",
                coordinates: this.generateNearbyCoordinates(1.2)
            },
            {
                name: "Organic Oasis",
                type: "Organic Food Store",
                distance: "0.9 miles",
                rating: 4.6,
                priceRange: "high",
                dietTypes: ["vegetarian", "vegan", "balanced"],
                address: "987 Organic Way, Green Valley",
                phone: "(555) 678-9012",
                coordinates: this.generateNearbyCoordinates(0.9)
            },
            {
                name: "Paleo Paradise",
                type: "Paleo Restaurant",
                distance: "1.1 miles",
                rating: 4.4,
                priceRange: "high",
                dietTypes: ["paleo", "balanced"],
                address: "147 Caveman Court, Stone Age Plaza",
                phone: "(555) 789-0123",
                coordinates: this.generateNearbyCoordinates(1.1)
            },
            {
                name: "Balanced Bites",
                type: "Healthy Fast Food",
                distance: "0.4 miles",
                rating: 4.1,
                priceRange: "medium",
                dietTypes: ["balanced", "vegetarian"],
                address: "258 Quick Healthy St, Fast Lane",
                phone: "(555) 890-1234",
                coordinates: this.generateNearbyCoordinates(0.4)
            }
        ];

        // Filter locations based on diet type and budget
        const suitableLocations = mockLocations.filter(location => {
            const budgetMatch = this.checkBudgetMatch(location.priceRange, budget);
            const dietMatch = location.dietTypes.includes(dietType) || location.dietTypes.includes("all");
            return budgetMatch && dietMatch;
        });

        // Sort by distance and take top 5
        const sortedLocations = suitableLocations.sort((a, b) => {
            const distanceA = parseFloat(a.distance);
            const distanceB = parseFloat(b.distance);
            return distanceA - distanceB;
        });

        this.userProfile.nearbyLocations = sortedLocations.slice(0, 5);
    }

    // Generate realistic nearby coordinates based on distance
    generateNearbyCoordinates(distanceMiles) {
        if (!this.userLocation) {
            // Default coordinates (San Francisco) if no user location
            return {
                lat: 37.7749 + (Math.random() - 0.5) * 0.02,
                lng: -122.4194 + (Math.random() - 0.5) * 0.02
            };
        }

        // Convert miles to approximate degrees (rough conversion)
        const degreeOffset = distanceMiles * 0.0145; // Approximately 1 mile = 0.0145 degrees
        
        // Generate random direction
        const angle = Math.random() * 2 * Math.PI;
        const latOffset = Math.cos(angle) * degreeOffset * (0.8 + Math.random() * 0.4);
        const lngOffset = Math.sin(angle) * degreeOffset * (0.8 + Math.random() * 0.4);

        return {
            lat: this.userLocation.latitude + latOffset,
            lng: this.userLocation.longitude + lngOffset
        };
    }

    // Generate Google Maps URL
    generateGoogleMapsUrl(location) {
        const { lat, lng } = location.coordinates;
        const query = encodeURIComponent(`${location.name}, ${location.address}`);
        
        // Create Google Maps URL with the location
        return `https://www.google.com/maps/search/?api=1&query=${query}&center=${lat},${lng}`;
    }

    checkBudgetMatch(locationPrice, userBudget) {
        const priceMapping = {
            'low': ['low'],
            'medium': ['low', 'medium'],
            'high': ['low', 'medium', 'high'],
            'premium': ['low', 'medium', 'high', 'premium']
        };
        
        return priceMapping[userBudget]?.includes(locationPrice) || false;
    }

    // Display results
    displayResults() {
        this.displayNutritionGoals();
        this.displayFoodRecommendations();
        this.displayNearbyLocations();
        
        // Show results section
        document.getElementById('results').style.display = 'block';
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    }

    displayNutritionGoals() {
        const container = document.getElementById('nutritionGoals');
        const goals = this.userProfile.nutritionGoals;
        
        container.innerHTML = `
            <div class="nutrition-item">
                <span class="nutrition-label">Daily Calories</span>
                <span class="nutrition-value">${goals.calories} kcal</span>
            </div>
            <div class="nutrition-item">
                <span class="nutrition-label">Protein</span>
                <span class="nutrition-value">${goals.protein}g</span>
            </div>
            <div class="nutrition-item">
                <span class="nutrition-label">Carbohydrates</span>
                <span class="nutrition-value">${goals.carbs}g</span>
            </div>
            <div class="nutrition-item">
                <span class="nutrition-label">Fat</span>
                <span class="nutrition-value">${goals.fat}g</span>
            </div>
            <div class="nutrition-item">
                <span class="nutrition-label">Fiber</span>
                <span class="nutrition-value">${goals.fiber}g</span>
            </div>
            <div class="nutrition-item">
                <span class="nutrition-label">Water</span>
                <span class="nutrition-value">${goals.water}ml</span>
            </div>
        `;
    }

    displayFoodRecommendations() {
        const container = document.getElementById('foodRecommendations');
        const recommendations = this.userProfile.recommendations;
        
        if (!recommendations || recommendations.length === 0) {
            container.innerHTML = '<p>No suitable recommendations found. Please adjust your preferences.</p>';
            return;
        }
        
        container.innerHTML = recommendations.map(food => `
            <div class="food-item">
                <div class="food-name">${food.name}</div>
                <div class="food-description">${food.description}</div>
                <div class="food-benefits">
                    ${food.benefits.map(benefit => `<span class="benefit-tag">${benefit}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    displayNearbyLocations() {
        const container = document.getElementById('nearbyLocations');
        const locations = this.userProfile.nearbyLocations;
        
        if (!this.userLocation) {
            container.innerHTML = `
                <div class="location-notice">
                    <i class="fas fa-info-circle"></i> 
                    <p>Enable location access to see nearby restaurants and stores with Google Maps integration.</p>
                    <button onclick="document.getElementById('getLocation').click()" class="enable-location-btn">
                        <i class="fas fa-crosshairs"></i> Enable Location
                    </button>
                </div>
            `;
            return;
        }
        
        if (!locations || locations.length === 0) {
            container.innerHTML = `
                <div class="location-notice">
                    <i class="fas fa-search"></i>
                    <p>No suitable locations found nearby. Try adjusting your budget or diet preferences.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = locations.map((location, index) => {
            const topDishes = this.getTopDishesForLocation(location.name);
            
            return `
                <div class="location-item" data-index="${index}">
                    <div class="location-header">
                        <div class="location-name">${location.name}</div>
                        <div class="location-rating">⭐ ${location.rating}/5</div>
                    </div>
                    <div class="location-type">${location.type}</div>
                    <div class="location-address">📍 ${location.address}</div>
                    <div class="location-contact">📞 ${location.phone}</div>
                    <div class="location-distance">🚶 ${location.distance} away</div>
                    
                    ${topDishes.length > 0 ? `
                        <div class="recommended-dishes">
                            <h4><i class="fas fa-star"></i> Top Recommended Dishes for You</h4>
                            <div class="dishes-grid">
                                ${topDishes.map(dish => `
                                    <div class="dish-card">
                                        <div class="dish-header">
                                            <div class="dish-name">${dish.name}</div>
                                            <div class="dish-price">${dish.price}</div>
                                            ${dish.popular ? '<span class="popular-badge">Popular</span>' : ''}
                                        </div>
                                        <div class="dish-description">${dish.description}</div>
                                        <div class="dish-nutrition">
                                            <span class="nutrition-item">🔥 ${dish.calories} cal</span>
                                            <span class="nutrition-item">💪 ${dish.protein}g protein</span>
                                            <span class="dish-rating">⭐ ${dish.rating}</span>
                                        </div>
                                        <div class="dish-benefits">
                                            ${dish.benefits.slice(0, 3).map(benefit => `<span class="benefit-tag">${benefit}</span>`).join('')}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="location-actions">
                        <a href="${this.generateGoogleMapsUrl(location)}" 
                           target="_blank" 
                           class="maps-btn"
                           onclick="this.style.transform='scale(0.95)'; setTimeout(() => this.style.transform='scale(1)', 150)">
                            <i class="fas fa-map-marker-alt"></i>
                            View on Google Maps
                        </a>
                        <button class="directions-btn" onclick="window.open('${this.generateDirectionsUrl(location)}', '_blank')">
                            <i class="fas fa-route"></i>
                            Get Directions
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Generate Google Maps directions URL
    generateDirectionsUrl(location) {
        const { lat, lng } = location.coordinates;
        const destination = encodeURIComponent(`${location.name}, ${location.address}`);
        
        if (this.userLocation) {
            return `https://www.google.com/maps/dir/${this.userLocation.latitude},${this.userLocation.longitude}/${lat},${lng}`;
        } else {
            return `https://www.google.com/maps/dir//${lat},${lng}`;
        }
    }

    // Load food database and menu database
    loadFoodDatabase() {
        this.foodDatabase = [
            {
                name: "Quinoa Bowl",
                description: "Complete protein grain with vegetables and healthy fats",
                dietTypes: ["vegetarian", "vegan", "balanced", "high-protein"],
                benefits: ["high-protein", "complex-carbs", "nutrient-dense"],
                allergens: []
            },
            {
                name: "Grilled Salmon",
                description: "Omega-3 rich fish with anti-inflammatory properties",
                dietTypes: ["balanced", "high-protein", "mediterranean", "paleo"],
                benefits: ["high-protein", "healthy-fats", "omega-3"],
                allergens: []
            },
            {
                name: "Avocado Toast",
                description: "Healthy fats with fiber-rich whole grain bread",
                dietTypes: ["vegetarian", "balanced", "mediterranean"],
                benefits: ["healthy-fats", "fiber", "nutrient-dense"],
                allergens: ["gluten"]
            },
            {
                name: "Greek Yogurt with Berries",
                description: "Probiotic-rich protein source with antioxidants",
                dietTypes: ["vegetarian", "balanced", "high-protein"],
                benefits: ["high-protein", "probiotics", "antioxidants"],
                allergens: ["dairy"]
            },
            {
                name: "Keto Cauliflower Rice",
                description: "Low-carb rice alternative with vegetables",
                dietTypes: ["keto", "low-carb", "vegetarian"],
                benefits: ["low-calorie", "low-carb", "fiber"],
                allergens: []
            },
            {
                name: "Lentil Soup",
                description: "Plant-based protein with fiber and minerals",
                dietTypes: ["vegetarian", "vegan", "balanced"],
                benefits: ["high-protein", "fiber", "low-calorie"],
                allergens: []
            },
            {
                name: "Chicken Breast",
                description: "Lean protein source for muscle building",
                dietTypes: ["balanced", "high-protein", "paleo"],
                benefits: ["high-protein", "low-calorie", "muscle-building"],
                allergens: []
            },
            {
                name: "Sweet Potato",
                description: "Complex carbohydrates with beta-carotene",
                dietTypes: ["vegetarian", "vegan", "balanced", "paleo"],
                benefits: ["complex-carbs", "fiber", "antioxidants"],
                allergens: []
            },
            {
                name: "Almonds",
                description: "Healthy fats and protein for sustained energy",
                dietTypes: ["vegetarian", "vegan", "keto", "paleo", "balanced"],
                benefits: ["healthy-fats", "high-protein", "vitamin-e"],
                allergens: ["nuts"]
            },
            {
                name: "Spinach Salad",
                description: "Iron-rich leafy greens with vitamins",
                dietTypes: ["vegetarian", "vegan", "balanced", "keto", "paleo"],
                benefits: ["low-calorie", "iron", "antioxidants"],
                allergens: []
            },
            {
                name: "Eggs",
                description: "Complete protein with essential amino acids",
                dietTypes: ["vegetarian", "balanced", "keto", "paleo"],
                benefits: ["high-protein", "complete-amino", "choline"],
                allergens: ["eggs"]
            },
            {
                name: "Brown Rice",
                description: "Whole grain carbohydrate for sustained energy",
                dietTypes: ["vegetarian", "vegan", "balanced"],
                benefits: ["complex-carbs", "fiber", "b-vitamins"],
                allergens: []
            }
        ];

        // Load restaurant menus database
        this.loadMenuDatabase();
    }

    // Load menu database for each restaurant
    loadMenuDatabase() {
        this.menuDatabase = {
            "Green Garden Cafe": [
                {
                    name: "Buddha Bowl Supreme",
                    description: "Quinoa, roasted vegetables, avocado, tahini dressing",
                    price: "$14.99",
                    calories: 520,
                    protein: 18,
                    dietTypes: ["vegetarian", "vegan", "balanced"],
                    benefits: ["high-protein", "nutrient-dense", "fiber"],
                    allergens: [],
                    rating: 4.8,
                    popular: true
                },
                {
                    name: "Green Goddess Smoothie Bowl",
                    description: "Spinach, mango, coconut, chia seeds, granola",
                    price: "$12.99",
                    calories: 380,
                    protein: 12,
                    dietTypes: ["vegetarian", "vegan", "balanced"],
                    benefits: ["antioxidants", "fiber", "probiotics"],
                    allergens: ["nuts"],
                    rating: 4.6,
                    popular: true
                },
                {
                    name: "Lentil Power Soup",
                    description: "Red lentils, vegetables, coconut milk, spices",
                    price: "$10.99",
                    calories: 290,
                    protein: 16,
                    dietTypes: ["vegetarian", "vegan", "balanced"],
                    benefits: ["high-protein", "low-calorie", "fiber"],
                    allergens: [],
                    rating: 4.5,
                    popular: false
                }
            ],
            "Protein Palace": [
                {
                    name: "Beast Mode Burger",
                    description: "Grass-fed beef, sweet potato fries, protein shake",
                    price: "$18.99",
                    calories: 780,
                    protein: 45,
                    dietTypes: ["high-protein", "paleo", "balanced"],
                    benefits: ["high-protein", "muscle-building", "iron"],
                    allergens: [],
                    rating: 4.7,
                    popular: true
                },
                {
                    name: "Keto Power Bowl",
                    description: "Grilled chicken, avocado, cheese, low-carb vegetables",
                    price: "$16.99",
                    calories: 620,
                    protein: 38,
                    dietTypes: ["keto", "high-protein", "low-carb"],
                    benefits: ["high-protein", "healthy-fats", "low-carb"],
                    allergens: ["dairy"],
                    rating: 4.5,
                    popular: true
                },
                {
                    name: "Protein Pancakes Stack",
                    description: "Whey protein pancakes, berries, sugar-free syrup",
                    price: "$13.99",
                    calories: 450,
                    protein: 32,
                    dietTypes: ["high-protein", "balanced"],
                    benefits: ["high-protein", "muscle-building", "antioxidants"],
                    allergens: ["dairy", "eggs", "gluten"],
                    rating: 4.3,
                    popular: false
                }
            ],
            "Mediterranean Delights": [
                {
                    name: "Grilled Salmon Platter",
                    description: "Atlantic salmon, quinoa tabbouleh, tzatziki",
                    price: "$22.99",
                    calories: 650,
                    protein: 42,
                    dietTypes: ["mediterranean", "balanced", "high-protein"],
                    benefits: ["omega-3", "high-protein", "heart-healthy"],
                    allergens: ["dairy"],
                    rating: 4.9,
                    popular: true
                },
                {
                    name: "Mediterranean Mezze Bowl",
                    description: "Hummus, falafel, olives, vegetables, pita",
                    price: "$16.99",
                    calories: 580,
                    protein: 22,
                    dietTypes: ["mediterranean", "vegetarian", "balanced"],
                    benefits: ["fiber", "healthy-fats", "antioxidants"],
                    allergens: ["gluten"],
                    rating: 4.6,
                    popular: true
                },
                {
                    name: "Greek Chicken Souvlaki",
                    description: "Marinated chicken skewers, Greek salad, rice",
                    price: "$19.99",
                    calories: 720,
                    protein: 38,
                    dietTypes: ["mediterranean", "balanced", "high-protein"],
                    benefits: ["high-protein", "lean-meat", "vegetables"],
                    allergens: [],
                    rating: 4.4,
                    popular: false
                }
            ],
            "Keto Kitchen": [
                {
                    name: "Keto Ribeye Steak",
                    description: "Grass-fed ribeye, butter, asparagus, cauliflower mash",
                    price: "$28.99",
                    calories: 820,
                    protein: 48,
                    dietTypes: ["keto", "low-carb", "high-protein"],
                    benefits: ["high-protein", "healthy-fats", "zero-carb"],
                    allergens: ["dairy"],
                    rating: 4.8,
                    popular: true
                },
                {
                    name: "Avocado Bacon Salad",
                    description: "Mixed greens, avocado, bacon, cheese, olive oil",
                    price: "$15.99",
                    calories: 520,
                    protein: 18,
                    dietTypes: ["keto", "low-carb"],
                    benefits: ["healthy-fats", "low-carb", "fiber"],
                    allergens: ["dairy"],
                    rating: 4.5,
                    popular: true
                },
                {
                    name: "Keto Chocolate Mousse",
                    description: "Sugar-free chocolate mousse with whipped cream",
                    price: "$8.99",
                    calories: 280,
                    protein: 6,
                    dietTypes: ["keto", "low-carb"],
                    benefits: ["low-carb", "sugar-free", "antioxidants"],
                    allergens: ["dairy"],
                    rating: 4.2,
                    popular: false
                }
            ],
            "Fresh Market": [
                {
                    name: "Build Your Own Salad Bar",
                    description: "Fresh greens, proteins, toppings, dressings",
                    price: "$8.99/lb",
                    calories: 350,
                    protein: 15,
                    dietTypes: ["all"],
                    benefits: ["customizable", "fresh", "nutrient-dense"],
                    allergens: ["varies"],
                    rating: 4.2,
                    popular: true
                },
                {
                    name: "Organic Smoothie Station",
                    description: "Fresh fruits, vegetables, protein powders, superfoods",
                    price: "$6.99-$9.99",
                    calories: 280,
                    protein: 20,
                    dietTypes: ["all"],
                    benefits: ["antioxidants", "customizable", "protein-boost"],
                    allergens: ["varies"],
                    rating: 4.0,
                    popular: true
                },
                {
                    name: "Prepared Meal Section",
                    description: "Ready-to-eat healthy meals, various cuisines",
                    price: "$7.99-$12.99",
                    calories: 450,
                    protein: 25,
                    dietTypes: ["all"],
                    benefits: ["convenient", "variety", "balanced"],
                    allergens: ["varies"],
                    rating: 3.8,
                    popular: false
                }
            ],
            "Organic Oasis": [
                {
                    name: "Superfood Acai Bowl",
                    description: "Acai, granola, fresh berries, coconut, honey",
                    price: "$13.99",
                    calories: 420,
                    protein: 14,
                    dietTypes: ["vegetarian", "vegan", "balanced"],
                    benefits: ["antioxidants", "fiber", "energy-boost"],
                    allergens: ["nuts"],
                    rating: 4.7,
                    popular: true
                },
                {
                    name: "Organic Green Juice",
                    description: "Kale, spinach, cucumber, apple, lemon, ginger",
                    price: "$8.99",
                    calories: 120,
                    protein: 4,
                    dietTypes: ["vegetarian", "vegan", "balanced"],
                    benefits: ["detox", "vitamins", "low-calorie"],
                    allergens: [],
                    rating: 4.4,
                    popular: true
                },
                {
                    name: "Raw Vegan Wrap",
                    description: "Collard greens, hummus, vegetables, sprouts",
                    price: "$11.99",
                    calories: 320,
                    protein: 12,
                    dietTypes: ["vegan", "balanced"],
                    benefits: ["raw", "fiber", "nutrient-dense"],
                    allergens: [],
                    rating: 4.1,
                    popular: false
                }
            ],
            "Paleo Paradise": [
                {
                    name: "Caveman Steak Platter",
                    description: "Grass-fed steak, roasted vegetables, sweet potato",
                    price: "$26.99",
                    calories: 750,
                    protein: 52,
                    dietTypes: ["paleo", "balanced", "high-protein"],
                    benefits: ["high-protein", "iron", "complex-carbs"],
                    allergens: [],
                    rating: 4.8,
                    popular: true
                },
                {
                    name: "Paleo Salmon Bowl",
                    description: "Wild salmon, cauliflower rice, avocado, vegetables",
                    price: "$21.99",
                    calories: 580,
                    protein: 38,
                    dietTypes: ["paleo", "balanced", "high-protein"],
                    benefits: ["omega-3", "high-protein", "low-carb"],
                    allergens: [],
                    rating: 4.6,
                    popular: true
                },
                {
                    name: "Hunter's Chicken Salad",
                    description: "Grilled chicken, mixed greens, nuts, berries",
                    price: "$17.99",
                    calories: 480,
                    protein: 35,
                    dietTypes: ["paleo", "balanced", "high-protein"],
                    benefits: ["high-protein", "antioxidants", "healthy-fats"],
                    allergens: ["nuts"],
                    rating: 4.3,
                    popular: false
                }
            ],
            "Balanced Bites": [
                {
                    name: "Power Protein Bowl",
                    description: "Quinoa, grilled chicken, vegetables, tahini",
                    price: "$13.99",
                    calories: 520,
                    protein: 32,
                    dietTypes: ["balanced", "high-protein"],
                    benefits: ["high-protein", "complex-carbs", "balanced"],
                    allergens: [],
                    rating: 4.4,
                    popular: true
                },
                {
                    name: "Veggie Burger Deluxe",
                    description: "Plant-based patty, sweet potato fries, side salad",
                    price: "$12.99",
                    calories: 480,
                    protein: 22,
                    dietTypes: ["vegetarian", "balanced"],
                    benefits: ["plant-protein", "fiber", "balanced"],
                    allergens: ["gluten"],
                    rating: 4.2,
                    popular: true
                },
                {
                    name: "Balanced Wrap",
                    description: "Whole wheat wrap, turkey, vegetables, hummus",
                    price: "$10.99",
                    calories: 420,
                    protein: 28,
                    dietTypes: ["balanced", "high-protein"],
                    benefits: ["balanced", "fiber", "lean-protein"],
                    allergens: ["gluten"],
                    rating: 4.0,
                    popular: false
                }
            ]
        };
    }

    // Get top dishes for a location
    getTopDishesForLocation(locationName) {
        const menu = this.menuDatabase[locationName];
        if (!menu) return [];

        const { dietType, fitnessGoal, allergies } = this.userProfile;

        // Filter dishes based on user preferences
        const suitableDishes = menu.filter(dish => {
            // Check diet compatibility
            if (!dish.dietTypes.includes(dietType) && !dish.dietTypes.includes('all')) {
                return false;
            }
            
            // Check allergies
            if (allergies.some(allergy => dish.allergens.includes(allergy))) {
                return false;
            }
            
            return true;
        });

        // Score dishes based on fitness goals
        const goalPriority = {
            'weight-loss': ['low-calorie', 'high-protein', 'fiber'],
            'weight-gain': ['high-calorie', 'healthy-fats', 'complex-carbs'],
            'muscle-gain': ['high-protein', 'muscle-building', 'complete-amino'],
            'maintenance': ['balanced', 'nutrient-dense'],
            'endurance': ['complex-carbs', 'antioxidants', 'energy-boost']
        };

        const priorities = goalPriority[fitnessGoal] || ['balanced'];
        
        // Score dishes
        suitableDishes.forEach(dish => {
            let score = dish.rating * 10; // Base score from rating
            
            // Add points for popular dishes
            if (dish.popular) score += 15;
            
            // Add points for matching fitness goals
            priorities.forEach((priority, index) => {
                if (dish.benefits.includes(priority)) {
                    score += (priorities.length - index) * 8;
                }
            });
            
            dish.score = score;
        });

        // Return top 3 dishes
        return suitableDishes
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FoodWise();
});
