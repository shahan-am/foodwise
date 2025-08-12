# FoodWise - API Documentation

## 📋 **Overview**

FoodWise is a client-side application that processes all data locally in the browser. This document outlines the internal API structure, browser API integrations, and external service interfaces used by the application.

---

## 🏗️ **Internal API Architecture**

### **Core Application Class**
```javascript
class FoodWise {
    constructor()
    initializeApp()
    bindEvents()
    loadFoodDatabase()
}
```

---

## 🤖 **AI Analysis API**

### **Image Analysis Engine**

#### `analyzeBodyFromImage(file, dataUrl)`
Analyzes uploaded images to detect physical characteristics.

**Parameters:**
- `file` (File) - The uploaded image file
- `dataUrl` (String) - Base64 encoded image data

**Returns:**
```javascript
{
    physicalCharacteristics: {
        height: Number,        // 150-200 cm
        weight: Number,        // 40-130 kg
        age: Number,           // 16-70 years
        gender: String,        // 'male' | 'female'
        bmi: Number,           // Calculated BMI
        bodyType: String,      // 'Slim' | 'Athletic' | 'Stocky' | 'Heavy'
        fitnessLevel: String   // 'Beginner' | 'Moderate' | 'Active'
    },
    suggestions: {
        dietType: String,      // 'balanced' | 'high-protein' | 'low-carb' | etc.
        fitnessGoal: String,   // 'maintenance' | 'weight-loss' | 'muscle-gain'
        activityLevel: String  // 'light' | 'moderate' | 'active'
    },
    analysisDetails: {
        skinDetection: String,    // Percentage of body visible
        imageQuality: String,     // 'High' | 'Medium'
        aspectRatio: String,      // Image height/width ratio
        brightness: String,       // Average brightness level
        confidence: Number        // 0.0 - 1.0 confidence score
    }
}
```

**Example Usage:**
```javascript
const analysis = await foodWise.analyzeBodyFromImage(imageFile, dataUrl);
console.log(`Detected height: ${analysis.physicalCharacteristics.height}cm`);
```

#### `performImageAnalysis(dataUrl)`
Low-level image processing using Canvas API.

**Parameters:**
- `dataUrl` (String) - Base64 encoded image data

**Returns:**
```javascript
{
    skinRatio: Number,         // 0.0 - 1.0, percentage of skin pixels
    darkRatio: Number,         // 0.0 - 1.0, percentage of dark pixels
    brightRatio: Number,       // 0.0 - 1.0, percentage of bright pixels
    textureComplexity: Number, // Color variance measure
    aspectRatio: Number,       // Height/width ratio
    avgColors: {
        r: Number,             // Average red value (0-255)
        g: Number,             // Average green value (0-255)
        b: Number              // Average blue value (0-255)
    },
    dimensions: {
        width: Number,         // Image width in pixels
        height: Number         // Image height in pixels
    },
    totalPixels: Number        // Total pixel count
}
```

#### `isSkinTone(r, g, b)`
Detects skin tone pixels using RGB values.

**Parameters:**
- `r` (Number) - Red value (0-255)
- `g` (Number) - Green value (0-255)
- `b` (Number) - Blue value (0-255)

**Returns:**
- `Boolean` - True if pixel represents skin tone

**Algorithm:**
```javascript
return (r > 95 && g > 40 && b > 20 && 
        Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
        Math.abs(r - g) > 15 && r > g && r > b);
```

---

## 🧮 **Nutrition Calculation API**

### **BMR Calculator**

#### `calculateNutritionGoals()`
Calculates daily nutritional requirements using Mifflin-St Jeor equation.

**Formula:**
```javascript
// For males
BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) + 5

// For females  
BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) - 161
```

**Activity Multipliers:**
```javascript
{
    'sedentary': 1.2,      // Little/no exercise
    'light': 1.375,        // Light exercise 1-3 days/week
    'moderate': 1.55,      // Moderate exercise 3-5 days/week
    'active': 1.725,       // Heavy exercise 6-7 days/week
    'very-active': 1.9     // Very heavy exercise, 2x/day
}
```

**Goal Adjustments:**
```javascript
{
    'weight-loss': -500,   // 500 calorie deficit
    'weight-gain': +500,   // 500 calorie surplus
    'muscle-gain': +300,   // 300 calorie surplus
    'maintenance': 0       // No adjustment
}
```

#### `calculateMacros(calories, dietType)`
Calculates macronutrient distribution based on diet type.

**Diet Type Ratios:**
```javascript
{
    'keto': { protein: 0.25, carbs: 0.05, fat: 0.70 },
    'high-protein': { protein: 0.35, carbs: 0.35, fat: 0.30 },
    'low-carb': { protein: 0.30, carbs: 0.20, fat: 0.50 },
    'balanced': { protein: 0.25, carbs: 0.45, fat: 0.30 },
    'mediterranean': { protein: 0.20, carbs: 0.50, fat: 0.30 }
}
```

**Returns:**
```javascript
{
    protein: Number,  // Grams of protein
    carbs: Number,    // Grams of carbohydrates  
    fat: Number       // Grams of fat
}
```

---

## 🍽️ **Food Recommendation API**

### **Food Database Structure**

#### Food Item Schema
```javascript
{
    name: String,                    // Food name
    description: String,             // Description
    dietTypes: Array<String>,        // Compatible diet types
    benefits: Array<String>,         // Health benefits
    allergens: Array<String>,        // Allergen information
    nutritionalInfo: {
        calories: Number,            // Per serving
        protein: Number,             // Grams
        carbs: Number,              // Grams
        fat: Number                 // Grams
    }
}
```

#### `generateFoodRecommendations()`
Generates personalized food recommendations.

**Algorithm:**
1. Filter foods by diet compatibility
2. Remove foods with user allergens
3. Score foods based on fitness goals
4. Sort by score and return top matches

**Scoring System:**
```javascript
const goalPriority = {
    'weight-loss': ['low-calorie', 'high-fiber', 'high-protein'],
    'weight-gain': ['high-calorie', 'healthy-fats', 'complex-carbs'],
    'muscle-gain': ['high-protein', 'complex-carbs', 'healthy-fats'],
    'maintenance': ['balanced', 'nutrient-dense'],
    'endurance': ['complex-carbs', 'antioxidants', 'electrolytes']
};
```

---

## 🗺️ **Location Services API**

### **Geolocation Integration**

#### `getCurrentLocation()`
Retrieves user's current GPS coordinates.

**Returns:**
```javascript
Promise<{
    latitude: Number,   // GPS latitude
    longitude: Number   // GPS longitude
}>
```

**Error Handling:**
```javascript
{
    PERMISSION_DENIED: 'Location access denied by user',
    POSITION_UNAVAILABLE: 'Location information unavailable', 
    TIMEOUT: 'Location request timed out'
}
```

**Configuration:**
```javascript
{
    enableHighAccuracy: true,  // Use GPS if available
    timeout: 10000,           // 10 second timeout
    maximumAge: 60000         // Cache for 1 minute
}
```

### **Restaurant Finder**

#### `findNearbyLocations()`
Finds restaurants matching user preferences.

**Filtering Criteria:**
- Diet type compatibility
- Budget range matching
- Distance from user location
- Rating threshold

**Mock Location Data:**
```javascript
{
    name: String,              // Restaurant name
    type: String,              // Restaurant type
    distance: String,          // Distance from user
    rating: Number,            // 1-5 star rating
    priceRange: String,        // 'low' | 'medium' | 'high' | 'premium'
    dietTypes: Array<String>,  // Supported diet types
    address: String,           // Full address
    phone: String,             // Contact number
    coordinates: {
        lat: Number,           // Latitude
        lng: Number            // Longitude
    }
}
```

#### `generateGoogleMapsUrl(location)`
Creates Google Maps URL for location viewing.

**Parameters:**
- `location` (Object) - Location data with coordinates

**Returns:**
- `String` - Google Maps URL

**URL Format:**
```
https://www.google.com/maps/search/?api=1&query={name}&center={lat},{lng}
```

#### `generateDirectionsUrl(location)`
Creates Google Maps directions URL.

**Returns:**
- `String` - Google Maps directions URL

**URL Format:**
```
https://www.google.com/maps/dir/{userLat},{userLng}/{destLat},{destLng}
```

---

## 📱 **Camera API Integration**

### **Camera Service**

#### `startCamera(facingMode)`
Initializes camera stream.

**Parameters:**
- `facingMode` (String) - 'user' (front) | 'environment' (back)

**Constraints:**
```javascript
{
    video: {
        facingMode: facingMode,
        width: { ideal: 1280 },
        height: { ideal: 720 }
    }
}
```

**Returns:**
- `Promise<MediaStream>` - Camera video stream

#### `capturePhotoFromCamera()`
Captures photo from active camera stream.

**Process:**
1. Get video element dimensions
2. Create canvas with matching size
3. Draw video frame to canvas
4. Convert canvas to blob
5. Create File object from blob

**Returns:**
- `File` - Captured image file

#### `switchCamera()`
Toggles between front and back cameras.

**Implementation:**
```javascript
this.currentFacingMode = this.currentFacingMode === 'environment' ? 'user' : 'environment';
await this.startCamera();
```

---

## 🎨 **UI Animation API**

### **Form Auto-Fill System**

#### `autoFillFormFields(analysis)`
Automatically populates form fields with AI analysis results.

**Animation Sequence:**
1. Physical characteristics (200ms intervals)
2. AI suggestions (200ms intervals)  
3. Success notification (1600ms delay)

#### `animateFieldUpdate(fieldId, value)`
Animates individual field updates.

**Animation States:**
1. `field-updating` - Yellow highlight during update
2. `field-updated` - Green flash on completion
3. Normal state - Return to default styling

**CSS Classes:**
```css
.field-updating {
    background: #fff3cd !important;
    border-color: #ffc107 !important;
    transform: scale(1.02);
    box-shadow: 0 0 10px rgba(255, 193, 7, 0.3);
}

.field-updated {
    background: #d4edda !important;
    border-color: #28a745 !important;
    animation: fieldSuccess 1s ease;
}
```

---

## 🔒 **Security & Validation API**

### **Input Validation**

#### `validateFile(file)`
Validates uploaded files for security and compatibility.

**Validation Rules:**
```javascript
{
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxSize: 10 * 1024 * 1024,  // 10MB
    minSize: 1024                // 1KB
}
```

**Returns:**
```javascript
{
    valid: Boolean,
    error: String | null
}
```

#### `sanitizeInput(input)`
Sanitizes user input to prevent XSS attacks.

**Sanitization Rules:**
- Remove HTML tags
- Escape special characters
- Validate numeric ranges
- Trim whitespace

---

## 📊 **Data Management API**

### **Local Storage**

#### Data Persistence Strategy
- **Session-based storage** - Data cleared on browser close
- **No server communication** - All data remains local
- **Privacy-first approach** - No external data transmission

#### Storage Structure
```javascript
{
    userProfile: {
        physicalCharacteristics: Object,
        preferences: Object,
        nutritionGoals: Object
    },
    analysisResults: Object,
    locationData: Object,
    sessionId: String
}
```

---

## 🚀 **Performance API**

### **Resource Management**

#### `cleanupCanvas(canvas)`
Releases canvas memory resources.

#### `releaseMediaStream(stream)`
Stops camera stream and releases resources.

#### `debounce(func, wait)`
Prevents excessive function calls.

**Usage:**
```javascript
const debouncedResize = ResourceManager.debounce(handleResize, 250);
window.addEventListener('resize', debouncedResize);
```

---

## 🔧 **Error Handling API**

### **Error Types**

#### Image Processing Errors
```javascript
{
    IMAGE_PROCESSING_ERROR: 'Unable to process image',
    INVALID_FILE_TYPE: 'Invalid file format',
    FILE_TOO_LARGE: 'File size exceeds limit',
    CANVAS_ERROR: 'Canvas processing failed'
}
```

#### Location Errors
```javascript
{
    LOCATION_ERROR: 'Location service error',
    PERMISSION_DENIED: 'Location access denied',
    POSITION_UNAVAILABLE: 'Location unavailable',
    TIMEOUT: 'Location request timeout'
}
```

#### Camera Errors
```javascript
{
    CAMERA_ERROR: 'Camera access error',
    NOT_ALLOWED: 'Camera permission denied',
    NOT_FOUND: 'No camera device found',
    NOT_SUPPORTED: 'Camera not supported'
}
```

---

## 📈 **Analytics & Monitoring**

### **Performance Metrics**

#### Tracked Events
```javascript
{
    imageUpload: 'Image upload initiated',
    analysisStart: 'AI analysis started',
    analysisComplete: 'AI analysis completed',
    autoFillSuccess: 'Form auto-filled successfully',
    locationRequest: 'Location access requested',
    cameraAccess: 'Camera access requested'
}
```

#### Performance Timers
```javascript
{
    imageProcessingTime: 'Time to analyze image',
    autoFillDelay: 'Time from upload to form completion',
    locationDetectionTime: 'Time to get user location',
    cameraInitTime: 'Time to initialize camera'
}
```

---

## 🔮 **Future API Extensions**

### **Planned Enhancements**

#### Real ML Integration
```javascript
// TensorFlow.js integration
class MLAnalyzer {
    async loadModel(modelUrl)
    async predictCharacteristics(imageData)
    async classifyBodyType(features)
}
```

#### Backend API Integration
```javascript
// RESTful API endpoints
const API_ENDPOINTS = {
    analyzeImage: 'POST /api/v1/analyze',
    getUserProfile: 'GET /api/v1/profile',
    saveProfile: 'POST /api/v1/profile',
    getRecommendations: 'GET /api/v1/recommendations'
};
```

#### WebSocket Integration
```javascript
// Real-time updates
class RealtimeService {
    connect(userId)
    subscribeToUpdates()
    sendAnalysisResults(data)
}
```

---

*API Documentation Version: 1.0*  
*Last Updated: August 12, 2025*  
*Compatibility: Modern browsers with ES6+ support*
