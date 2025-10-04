# VeCare Chain - API Documentation 📡

Complete API reference for VeCare Chain backend services.

## Base URL

```
Local Development: http://localhost:3000
Production: https://your-domain.com/api
```

## Authentication

Currently, the API uses wallet-based authentication through VeChain dApp Kit. Future versions will include JWT tokens for enhanced security.

---

## 📋 Campaigns

### Create Campaign

Create a new medical crowdfunding campaign with AI verification.

**Endpoint:** `POST /campaigns`

**Request Body:**
```json
{
  "title": "Help Sarah Fight Cancer",
  "description": "Sarah is a 35-year-old mother of two who has been diagnosed with stage 3 breast cancer. She needs immediate treatment...",
  "medicalDocuments": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  ],
  "goalAmount": "5000",
  "durationDays": 60,
  "creatorAddress": "0x1234567890abcdef1234567890abcdef12345678"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "campaignId": 1,
    "isVerified": true,
    "verificationDetails": {
      "confidenceScore": 0.92,
      "documentType": "Doctor's Letter",
      "findings": [
        "Official hospital letterhead present",
        "Doctor credentials clearly visible",
        "Medical diagnosis clearly stated",
        "Treatment plan outlined"
      ],
      "reasoning": "The document appears to be an authentic medical letter with proper credentials and formatting.",
      "redFlags": []
    }
  },
  "txId": "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
}
```

**Validation Rules:**
- `title`: 5-200 characters
- `description`: 50-5000 characters
- `medicalDocuments`: Array of base64 images (at least 1)
- `goalAmount`: Positive number (string format)
- `durationDays`: 1-365
- `creatorAddress`: Valid Ethereum address

**Error Responses:**
```json
// 400 Bad Request
{
  "success": false,
  "error": "Campaign description must be at least 50 characters"
}

// 500 Internal Server Error
{
  "success": false,
  "error": "Failed to create campaign on blockchain"
}
```

---

### Get Campaign by ID

Retrieve detailed information about a specific campaign.

**Endpoint:** `GET /campaigns/:id`

**Parameters:**
- `id` (path): Campaign ID (integer)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "creator": "0x1234567890abcdef1234567890abcdef12345678",
    "title": "Help Sarah Fight Cancer",
    "description": "Sarah is a 35-year-old mother...",
    "medicalDocumentHash": "QmX7Zq9Y8W7V6U5T4S3R2Q1P0O9N8M7L6K5J4I3H2G1F0",
    "goalAmount": "5000",
    "raisedAmount": "1250.50",
    "deadline": 1735689600,
    "isActive": true,
    "isVerified": true,
    "fundsWithdrawn": false,
    "createdAt": 1730505600,
    "donorCount": 23
  }
}
```

**Error Responses:**
```json
// 404 Not Found
{
  "success": false,
  "error": "Campaign not found"
}
```

---

### Get All Campaigns

Retrieve a paginated list of campaigns.

**Endpoint:** `GET /campaigns`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Example:** `GET /campaigns?page=2&limit=10`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "creator": "0x1234...",
      "title": "Help Sarah Fight Cancer",
      "goalAmount": "5000",
      "raisedAmount": "1250.50",
      "isVerified": true,
      "donorCount": 23
    },
    // ... more campaigns
  ],
  "pagination": {
    "page": 2,
    "limit": 10,
    "count": 10
  }
}
```

---

### Get Active Verified Campaigns

Retrieve all active and verified campaigns.

**Endpoint:** `GET /campaigns/active/verified`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "creator": "0x1234...",
      "title": "Help Sarah Fight Cancer",
      "goalAmount": "5000",
      "raisedAmount": "1250.50",
      "deadline": 1735689600,
      "isActive": true,
      "isVerified": true,
      "donorCount": 23
    }
  ],
  "count": 5
}
```

---

### Check Goal Reached

Check if a campaign has reached its funding goal.

**Endpoint:** `GET /campaigns/:id/goal-reached`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "campaignId": 1,
    "goalReached": false
  }
}
```

---

### Get Campaign Updates

Get the number of updates posted for a campaign.

**Endpoint:** `GET /campaigns/:id/updates`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "campaignId": 1,
    "updateCount": 5
  }
}
```

---

## 👤 Creators

### Get Creator Profile

Retrieve profile information for a campaign creator.

**Endpoint:** `GET /creators/:address`

**Parameters:**
- `address` (path): Creator's wallet address

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalCampaigns": 3,
    "successfulCampaigns": 2,
    "totalRaised": "12500.75",
    "trustScore": 78,
    "lastUpdateTimestamp": 1730505600,
    "exists": true
  }
}
```

**Trust Score Breakdown:**
- 0-39: Building
- 40-59: Fair
- 60-79: Good
- 80-100: Excellent

**Error Responses:**
```json
// 404 Not Found
{
  "success": false,
  "error": "Creator profile not found"
}
```

---

## 💰 Donations

### Get Donation Details

Get donation amount for a specific donor to a campaign.

**Endpoint:** `GET /campaigns/:campaignId/donations/:donorAddress`

**Parameters:**
- `campaignId` (path): Campaign ID
- `donorAddress` (path): Donor's wallet address

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "campaignId": 1,
    "donorAddress": "0xabcd...",
    "amount": "100.50"
  }
}
```

---

## 🤖 AI Verification

### Verify Medical Documents

Verify medical documents without creating a campaign (preview mode).

**Endpoint:** `POST /verify-documents`

**Request Body:**
```json
{
  "medicalDocuments": [
    "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
    "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  ]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "isVerified": true,
    "confidenceScore": 0.87,
    "documentType": "Hospital Bill",
    "findings": [
      "Official hospital billing format",
      "Itemized medical charges present",
      "Patient information visible",
      "Hospital contact details included"
    ],
    "reasoning": "The document appears to be a legitimate hospital bill with proper formatting and all required information.",
    "redFlags": []
  }
}
```

**AI Verification Criteria:**

1. **Document Authenticity**
   - Official letterhead/stamps
   - Professional formatting
   - No signs of tampering

2. **Medical Legitimacy**
   - Proper medical terminology
   - Valid diagnosis/treatment info
   - Professional presentation

3. **Credibility Indicators**
   - Doctor/hospital credentials
   - Date of issue
   - Contact information

4. **Red Flags**
   - Screenshots detected
   - Poor quality/heavily edited
   - Missing critical elements
   - Inconsistent information

**Confidence Score Interpretation:**
- 0.0-0.3: Low confidence (likely fake)
- 0.3-0.5: Uncertain (needs review)
- 0.5-0.7: Moderate confidence (acceptable)
- 0.7-0.9: High confidence (verified)
- 0.9-1.0: Very high confidence (highly verified)

**Error Responses:**
```json
// 400 Bad Request
{
  "success": false,
  "error": "Medical documents are required"
}

// 500 Internal Server Error
{
  "success": false,
  "error": "Error during medical document verification"
}
```

---

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": { /* optional error details */ }
}
```

---

## 🔒 Rate Limiting

Currently not implemented. Future versions will include:
- 100 requests per minute per IP
- 1000 requests per hour per IP
- Special limits for AI verification (10 per minute)

---

## 🌐 CORS

CORS is enabled for all origins in development. In production, configure allowed origins in backend environment variables.

---

## 📝 Data Types

### Campaign Object
```typescript
interface Campaign {
  id: number;
  creator: string;              // Ethereum address
  title: string;
  description: string;
  medicalDocumentHash: string;  // IPFS hash
  goalAmount: string;           // In VET
  raisedAmount: string;         // In VET
  deadline: number;             // Unix timestamp
  isActive: boolean;
  isVerified: boolean;
  fundsWithdrawn: boolean;
  createdAt: number;            // Unix timestamp
  donorCount: number;
}
```

### Creator Profile Object
```typescript
interface CreatorProfile {
  totalCampaigns: number;
  successfulCampaigns: number;
  totalRaised: string;          // In VET
  trustScore: number;           // 0-100
  lastUpdateTimestamp: number;  // Unix timestamp
  exists: boolean;
}
```

### Verification Result Object
```typescript
interface VerificationResult {
  isVerified: boolean;
  confidenceScore: number;      // 0.0-1.0
  documentType: string;
  findings: string[];
  reasoning: string;
  redFlags: string[];
}
```

---

## 🧪 Testing the API

### Using cURL

```bash
# Create campaign
curl -X POST http://localhost:3000/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Campaign",
    "description": "This is a test campaign with at least 50 characters in the description to meet validation requirements.",
    "medicalDocuments": ["data:image/jpeg;base64,..."],
    "goalAmount": "1000",
    "durationDays": 30,
    "creatorAddress": "0x1234567890abcdef1234567890abcdef12345678"
  }'

# Get campaign
curl http://localhost:3000/campaigns/1

# Get all campaigns
curl http://localhost:3000/campaigns?page=1&limit=10

# Verify documents
curl -X POST http://localhost:3000/verify-documents \
  -H "Content-Type: application/json" \
  -d '{
    "medicalDocuments": ["data:image/jpeg;base64,..."]
  }'
```

### Using Postman

1. Import the collection (create one from this documentation)
2. Set base URL variable: `http://localhost:3000`
3. Test each endpoint
4. Check response status and data

### Using JavaScript/Fetch

```javascript
// Create campaign
const response = await fetch('http://localhost:3000/campaigns', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'Test Campaign',
    description: 'This is a test campaign...',
    medicalDocuments: ['data:image/jpeg;base64,...'],
    goalAmount: '1000',
    durationDays: 30,
    creatorAddress: '0x1234...'
  })
});

const data = await response.json();
console.log(data);
```

---

## 🐛 Error Codes

| Status Code | Meaning |
|------------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate or invalid state |
| 500 | Internal Server Error |

---

## 📚 Additional Resources

- [VeCare Chain Documentation](./VECARE_README.md)
- [Setup Guide](./SETUP_GUIDE.md)
- [Smart Contract Documentation](./apps/contracts/README.md)

---

## 🔄 Changelog

### v1.0.0 (Current)
- Initial API release
- Campaign CRUD operations
- AI verification endpoint
- Creator profile endpoint
- Donation tracking

### Future Versions
- v1.1.0: Rate limiting and authentication
- v1.2.0: Webhook support
- v1.3.0: Advanced filtering and search
- v2.0.0: GraphQL API

---

**Need help?** Check the [Setup Guide](./SETUP_GUIDE.md) or open an issue on GitHub.
