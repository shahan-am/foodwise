# FoodWise - Smart Food Recommendations

FoodWise is an intelligent food recommendation application that provides personalized nutrition advice based on your dietary requirements, fitness goals, budget, and location. Now featuring a **dedicated nearby restaurants section** with enhanced functionality!

## 🆕 Latest Updates

### ✨ Major Features Added:
- **🍽️ Separate Restaurants Section**: Dedicated section for nearby restaurants (moved from main results)
- **🗺️ Enhanced Geolocation**: Comprehensive error handling and permission management
- **🎨 Professional UI/UX**: Modern design system with animations and responsive layout
- **🔧 Robust Error Handling**: Graceful error recovery and detailed user feedback
- **🧪 Testing Suite**: Comprehensive debugging and testing tools

## Features

### 🤖 AI-Powered Person Analysis
- **Smart Image Recognition**: Upload photos of yourself for instant body composition analysis
- **Camera Capture**: Take selfies directly from your device's camera with real-time preview
- **Automatic Body Detection**: AI identifies height, weight, and body composition from photos
- **Health Assessment**: Calculates BMI, body fat percentage, and fitness level
- **Diet Type Suggestions**: Recommends optimal diet types based on your physical analysis
- **Auto-Fill Forms**: Automatically populates your profile based on AI body analysis
- **Multi-Format Support**: Accepts images (JPEG, PNG, GIF, WebP)
- **Camera Controls**: Switch between front/back cameras, optimized for selfie capture
- **Custom Nutrition Goals**: Calculates daily calorie, protein, carb, and fat requirements based on your profile
- **Diet Type Support**: Supports various diet types including vegetarian, vegan, keto, paleo, Mediterranean, and more
- **Fitness Goal Alignment**: Tailors recommendations for weight loss, weight gain, muscle building, or maintenance
- **Allergy Considerations**: Filters out foods based on your allergies and intolerances

### 🍽️ Dedicated Nearby Restaurants Section
- **Separate Section**: Beautiful standalone section for restaurant recommendations
- **Enhanced Restaurant Cards**: Professional design with detailed information
- **Google Maps Integration**: Direct links to view restaurants and get directions
- **Menu Recommendations**: Top dishes based on your dietary preferences
- **Restaurant Details**: Ratings, contact info, distance, and price range
- **Smooth Animations**: Cards animate in with staggered timing
- **Mobile Optimized**: Responsive design for all screen sizes

### 📍 Enhanced Location-Based Features
- **Advanced Geolocation**: Comprehensive permission handling and error recovery
- **Smart Error Messages**: Detailed guidance for location access issues
- **Fallback Support**: Works even when location access is denied
- **Real-time Status**: Live updates during location detection
- **Privacy Assurance**: Clear messaging about location data usage

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

### 2. AI Person Analysis (Optional)
- **Upload Your Photos**: Drag & drop or click to upload full-body photos of yourself
- **Take Selfies**: Use the "Take Selfie" button to capture photos directly from your camera
- **AI Analysis**: The system will automatically detect your body composition, estimate height/weight, and assess fitness level
- **Apply Suggestions**: Click "Apply AI Suggestions" to auto-fill your profile based on the analysis

### 3. Fill Out Your Profile
- **Personal Information**: Enter your weight, height, age, and gender
- **Diet & Goals**: Select your diet type, fitness goal, and activity level
- **Dietary Requirements**: Specify any allergies or intolerances
- **Budget**: Choose your preferred spending range per meal

### 4. Enable Location (Optional)
Click "Get My Location" to enable location-based restaurant recommendations with Google Maps integration.

### 5. Get Recommendations
Click "Get My Food Recommendations" to receive:
- **Nutrition Goals**: Personalized daily calorie and macro targets
- **Food Recommendations**: Categorized food suggestions with benefits
- **Nearby Restaurants**: Dedicated section with detailed restaurant information and menu recommendations

## 🧪 Testing & Development

### Testing Tools Available:
- **`test.html`**: Comprehensive application testing suite
- **`debug.html`**: Advanced debugging and diagnostic tools
- **`minimal-test.html`**: Isolated functionality testing
- **`js-test.html`**: JavaScript validation and syntax checking

### Development Features:
- **Fill Test Data**: Quick form filling for development testing
- **Console Logging**: Detailed step-by-step execution logging
- **Error Handling**: Comprehensive error recovery and user feedback
- **Performance Monitoring**: Built-in performance tracking

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with modern design system and CSS variables
- **Icons**: Font Awesome 6.0
- **Fonts**: Google Fonts (Poppins)
- **APIs**: Geolocation API, MediaDevices API, Canvas API
- **Integration**: Google Maps integration for directions and location viewing

## File Structure

```
FoodWise/
├── index.html                    # Main HTML structure
├── styles.css                    # Core CSS styling and responsive design
├── real-data-styles.css          # Additional styling for real data features
├── script.js                     # Main JavaScript functionality and logic
├── config.js                     # Configuration settings
├── location-service.js           # Enhanced location services
├── real-data-integration.js      # Real data integration capabilities
├── README.md                     # Documentation (this file)
├── TECHNICAL_DOCUMENTATION.md    # Detailed technical documentation
├── AWS_ARCHITECTURE.md           # AWS deployment architecture
├── REAL_DATA_SETUP.md           # Real data integration setup guide
├── test.html                     # Comprehensive testing suite
├── debug.html                    # Advanced debugging tools
├── minimal-test.html             # Minimal functionality testing
└── js-test.html                  # JavaScript validation tools
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
Features detailed menus for 8+ different restaurant types:
- **Green Garden Cafe**: Vegetarian/vegan specialties
- **Protein Palace**: High-protein and keto options
- **Mediterranean Delights**: Heart-healthy Mediterranean cuisine
- **Keto Kitchen**: Low-carb ketogenic meals
- **Fresh Market**: Customizable healthy options
- **Organic Oasis**: Superfood and organic dishes
- **Paleo Paradise**: Paleo-friendly meals
- **Balanced Bites**: Well-rounded nutrition options

### Enhanced Location Services
- Uses browser's Geolocation API with comprehensive error handling
- Google Maps integration for directions and location viewing
- Filters results based on diet preferences and budget
- Shows top 2-3 recommended dishes per location
- Graceful fallback when location access is denied

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Privacy & Security

- Location data is only used locally and not stored
- No personal data is transmitted to external servers
- All calculations are performed client-side
- Clear privacy messaging and user consent

## Demo Features

The application includes realistic demo data for:
- 8+ different restaurant types with full menus
- 24+ dishes with detailed nutritional information
- Smart recommendation algorithms
- Google Maps integration (opens actual Google Maps)
- Comprehensive error handling and user feedback

## 🚀 Recent Improvements

### Performance & Reliability:
- ✅ Fixed all JavaScript syntax errors
- ✅ Enhanced error handling and recovery
- ✅ Improved initialization robustness
- ✅ Better form validation and processing

### User Experience:
- ✅ Separate restaurants section with enhanced design
- ✅ Smooth animations and transitions
- ✅ Better visual hierarchy and spacing
- ✅ Improved mobile responsiveness

### Developer Experience:
- ✅ Comprehensive testing suite
- ✅ Advanced debugging tools
- ✅ Detailed logging and error reporting
- ✅ Modular code structure

## Future Enhancements

- Integration with real restaurant APIs (Google Places, Yelp)
- Meal planning and shopping list generation
- Progress tracking and goal monitoring
- Social features for sharing meal plans
- Integration with fitness trackers
- Nutritional analysis of custom meals
- User reviews and ratings system
- Real-time menu updates and availability

## Contributing

This project demonstrates modern web development practices with:
- Responsive design principles
- Progressive enhancement
- Accessibility considerations
- Performance optimization
- Error handling best practices

For production use, consider:
- Adding real restaurant API integration
- Implementing user authentication
- Adding a backend for data persistence
- Including more comprehensive food databases
- Adding nutritional analysis features

## License

This project is for educational and demonstration purposes.

---

**FoodWise** - Making healthy eating decisions easier, one recommendation at a time! 🍎

### 🔗 Repository
**GitHub**: [https://github.com/shahan-am/foodwise](https://github.com/shahan-am/foodwise)

### 📱 Live Demo
Open `index.html` in your browser or visit the deployed version for a full experience of the enhanced FoodWise application with the new separate restaurants section!
