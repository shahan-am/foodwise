# FoodWise AWS Architecture

## Recommended AWS Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   CloudFront    │────│    S3 Bucket     │────│   AWS Amplify   │
│   (Global CDN)  │    │  (Static Files)  │    │   (CI/CD)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  API Gateway    │────│   Lambda         │────│   DynamoDB      │
│  (REST API)     │    │  (Business Logic)│    │  (User Data)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Cognito       │    │   Bedrock        │    │  Location       │
│ (Authentication)│    │  (AI/ML)         │    │  Service        │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Implementation Phases

### Phase 1: Basic AWS Migration (Week 1-2)
1. **Deploy to S3 + CloudFront**
   - Upload static files to S3
   - Configure CloudFront distribution
   - Set up custom domain

2. **API Gateway + Lambda**
   - Create Lambda functions for restaurant search
   - Set up API Gateway endpoints
   - Implement CORS and security

### Phase 2: Data & User Management (Week 3-4)
1. **DynamoDB Setup**
   - User profiles table
   - Restaurant cache table
   - Search history table

2. **Cognito Integration**
   - User authentication
   - Profile management
   - Social login (Google, Facebook)

### Phase 3: AI Enhancement (Week 5-6)
1. **Bedrock Integration**
   - Smart menu recommendations
   - Nutritional analysis
   - Personalized suggestions

2. **Location Service**
   - Replace Google Places API
   - Implement geofencing
   - Real-time location updates

### Phase 4: Analytics & Optimization (Week 7-8)
1. **QuickSight Dashboard**
   - User behavior analytics
   - Restaurant popularity metrics
   - Performance monitoring

2. **Personalize Integration**
   - ML-based recommendations
   - User preference learning
   - A/B testing framework

## Cost Estimation (Monthly)

### Tier 1: Basic Setup (~$20-50/month)
- S3 + CloudFront: $5-15
- Lambda (100K requests): $0.20
- API Gateway: $3.50
- DynamoDB (basic usage): $5-25

### Tier 2: With AI Features (~$100-300/month)
- Basic setup: $20-50
- Bedrock (Claude): $50-200
- Location Service: $10-30
- Cognito: $5-20

### Tier 3: Full Analytics (~$200-500/month)
- Tier 2: $100-300
- QuickSight: $9/user
- Personalize: $50-150
- Enhanced monitoring: $20-50

## Sample Lambda Functions

### Restaurant Search Function
```javascript
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.searchRestaurants = async (event) => {
    const { latitude, longitude, dietType, budget } = JSON.parse(event.body);
    
    // Check cache first
    const cacheKey = `${latitude}_${longitude}_${dietType}_${budget}`;
    const cached = await dynamodb.get({
        TableName: 'RestaurantCache',
        Key: { cacheKey }
    }).promise();
    
    if (cached.Item && !isExpired(cached.Item.timestamp)) {
        return {
            statusCode: 200,
            body: JSON.stringify(cached.Item.restaurants)
        };
    }
    
    // Fetch from external APIs
    const restaurants = await fetchRestaurants(latitude, longitude, dietType);
    
    // Cache results
    await dynamodb.put({
        TableName: 'RestaurantCache',
        Item: {
            cacheKey,
            restaurants,
            timestamp: Date.now()
        }
    }).promise();
    
    return {
        statusCode: 200,
        body: JSON.stringify(restaurants)
    };
};
```

### AI Recommendation Function
```javascript
const AWS = require('aws-sdk');
const bedrock = new AWS.BedrockRuntime();

exports.getRecommendations = async (event) => {
    const { userId, restaurantMenu, userProfile } = JSON.parse(event.body);
    
    const prompt = `
    User Profile: ${JSON.stringify(userProfile)}
    Restaurant Menu: ${JSON.stringify(restaurantMenu)}
    
    Provide 3 personalized dish recommendations with:
    1. Dish name and description
    2. Estimated calories and macros
    3. Health benefits
    4. Why it matches the user's goals
    
    Format as JSON array.
    `;
    
    const response = await bedrock.invokeModel({
        modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
        contentType: 'application/json',
        body: JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 1000,
            messages: [{
                role: "user",
                content: prompt
            }]
        })
    }).promise();
    
    const recommendations = JSON.parse(response.body).content[0].text;
    
    return {
        statusCode: 200,
        body: recommendations
    };
};
```

## Migration Benefits

### Performance Improvements
- **Global CDN**: 50-80% faster load times
- **Serverless**: Auto-scaling, no server management
- **Caching**: Reduced API calls, faster responses

### Cost Optimization
- **Pay-per-use**: Only pay for actual usage
- **API Caching**: Reduce external API costs by 70-90%
- **Serverless**: No idle server costs

### Enhanced Features
- **AI Recommendations**: Personalized suggestions
- **User Profiles**: Save preferences and history
- **Analytics**: Understand user behavior
- **Security**: Enterprise-grade protection

### Scalability
- **Auto-scaling**: Handle traffic spikes automatically
- **Global**: Serve users worldwide efficiently
- **Reliability**: 99.9%+ uptime with AWS infrastructure

## Next Steps

1. **Start Small**: Begin with S3 + CloudFront deployment
2. **Add APIs**: Implement Lambda functions gradually
3. **Integrate AI**: Add Bedrock for smart recommendations
4. **Monitor & Optimize**: Use CloudWatch and QuickSight
5. **Scale Up**: Add more features based on user feedback

This architecture transforms your demo app into a production-ready, scalable, and intelligent food recommendation platform!
