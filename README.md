# FoodWise - Smart Food Recommendations

FoodWise is an intelligent food recommendation application that provides personalized nutrition advice based on your dietary requirements, fitness goals, budget, and location.

## Features

### 🎯 Personalized Recommendations
- **Custom Nutrition Goals**: Calculates daily calorie, protein, carb, and fat requirements based on your profile
- **Diet Type Support**: Supports various diet types including vegetarian, vegan, keto, paleo, Mediterranean, and more
- **Fitness Goal Alignment**: Tailors recommendations for weight loss, weight gain, muscle building, or maintenance
- **Allergy Considerations**: Filters out foods based on your allergies and intolerances

### 📍 Location-Based Features
- **Geolocation Integration**: Uses your current location to find nearby restaurants and food stores
- **Budget-Friendly Options**: Filters locations based on your budget preferences
- **Diet-Specific Venues**: Recommends restaurants that cater to your specific dietary needs
- **Google Maps Integration**: Clickable links to view locations and get directions

### 🍽️ Menu Recommendations
- **Top Dish Suggestions**: Shows 2-3 recommended dishes from each restaurant
- **Smart Dish Scoring**: Ranks dishes based on your diet, goals, and preferences
- **Detailed Nutrition Info**: Calories, protein, and health benefits for each dish
- **Popular Dish Indicators**: Highlights trending and highly-rated menu items

### 💡 Smart Algorithm
- **BMR Calculation**: Uses the Mifflin-St Jeor equation for accurate calorie calculations
- **Activity Level Adjustment**: Factors in your activity level for precise calorie needs
- **Macro Distribution**: Automatically calculates optimal protein, carb, and fat ratios
- **Food Scoring System**: Ranks food recommendations based on your specific goals

## How to Use

### 1. Setup
Simply open `index.html` in your web browser. No installation required!

### 2. Fill Out Your Profile
- **Personal Information**: Enter your weight, height, age, and gender
- **Diet & Goals**: Select your diet type, fitness goal, and activity level
- **Dietary Requirements**: Specify any allergies or intolerances
- **Budget**: Choose your preferred spending range per meal

### 3. Enable Location (Optional)
Click "Get My Location" to enable location-based restaurant recommendations with Google Maps integration.

### 4. Get Recommendations
Click "Get Food Recommendations" to receive your personalized nutrition plan, food suggestions, and nearby restaurant recommendations with specific dish recommendations.

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with gradient backgrounds and modern UI
- **Icons**: Font Awesome 6.0
- **Fonts**: Google Fonts (Poppins)
- **APIs**: Geolocation API, Google Maps integration

## File Structure

```
FoodWise/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality and logic
└── README.md          # Documentation
```

## Key Features Explained

### Nutrition Calculation
The app uses scientifically-backed formulas:
- **BMR Calculation**: Mifflin-St Jeor equation for baseline metabolic rate
- **Activity Multipliers**: Standard multipliers for different activity levels
- **Goal Adjustments**: Calorie adjustments based on fitness objectives

### Food Database
Includes a comprehensive database of foods with:
- Diet type compatibility
- Nutritional benefits
- Allergen information
- Health benefits tags

### Restaurant Menu Database
Features detailed menus for 8 different restaurant types:
- **Green Garden Cafe**: Vegetarian/vegan specialties
- **Protein Palace**: High-protein and keto options
- **Mediterranean Delights**: Heart-healthy Mediterranean cuisine
- **Keto Kitchen**: Low-carb ketogenic meals
- **Fresh Market**: Customizable healthy options
- **Organic Oasis**: Superfood and organic dishes
- **Paleo Paradise**: Paleo-friendly meals
- **Balanced Bites**: Well-rounded nutrition options

### Location Services
- Uses browser's Geolocation API
- Google Maps integration for directions
- Filters results based on diet preferences and budget
- Shows top 2-3 recommended dishes per location

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Privacy & Security

- Location data is only used locally and not stored
- No personal data is transmitted to external servers
- All calculations are performed client-side

## Demo Features

The application includes realistic demo data for:
- 8 different restaurant types with full menus
- 24+ dishes with detailed nutritional information
- Smart recommendation algorithms
- Google Maps integration (opens actual Google Maps)

## Future Enhancements

- Integration with real restaurant APIs (Google Places, Yelp)
- Meal planning and shopping list generation
- Progress tracking and goal monitoring
- Social features for sharing meal plans
- Integration with fitness trackers
- Nutritional analysis of custom meals
- User reviews and ratings system

## Contributing

This is a demonstration application. For production use, consider:
- Adding real restaurant API integration
- Implementing user authentication
- Adding a backend for data persistence
- Including more comprehensive food databases
- Adding nutritional analysis features

## License

This project is for educational and demonstration purposes.

---

**FoodWise** - Making healthy eating decisions easier, one recommendation at a time! 🍎
