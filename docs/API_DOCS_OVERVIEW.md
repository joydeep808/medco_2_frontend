# MedCo API Documentation Overview

This document provides an overview of all API documentation files organized by user roles and functionality.

## Documentation Files by Role

### 1. Customer API Documentation

**File**: `API_DOCS_CUSTOMER.md`
**Target Users**: End customers who order medicines
**Key Features**:

- User authentication and profile management
- Address management
- Order placement and tracking
- Cart management
- Coupon usage
- Medicine search and discovery

### 2. Pharmacy Owner API Documentation

**File**: `API_DOCS_PHARMACY_OWNER.md`
**Target Users**: Pharmacy owners and staff
**Key Features**:

- Pharmacy profile management
- Medicine inventory management
- Order processing (accept/reject/ready)
- Stock management
- Analytics and reporting
- Medicine categories

### 3. Delivery Agent API Documentation

**File**: `API_DOCS_DELIVERY_AGENT.md`
**Target Users**: Delivery agents
**Key Features**:

- Availability management
- Location tracking
- Order assignment handling
- Delivery status updates
- Earnings tracking
- Performance analytics

### 4. Admin API Documentation

**File**: `API_DOCS_ADMIN.md`
**Target Users**: Platform administrators
**Key Features**:

- User management
- Pharmacy approval/rejection
- Order oversight
- Coupon management
- Platform analytics
- System configuration

### 5. Public API Documentation

**File**: `API_DOCS_PUBLIC.md`
**Target Users**: All users (no authentication required for most endpoints)
**Key Features**:

- Medicine search and discovery
- Pharmacy search and discovery
- Universal search functionality
- Search suggestions and trending
- Public medicine and pharmacy information

## Common Response Structure

All APIs follow a consistent response format:

### Success Response

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": { ... },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### Paginated Response Structure

```json
{
  "content": [...],
  "pagination": {
    "page": 0,
    "size": 20,
    "totalElements": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrevious": false,
    "isFirst": true,
    "isLast": false
  },
  "filters": { ... }
}
```

## Authentication

Most endpoints require JWT token authentication:

- **Header**: `Authorization: Bearer <token>`
- **Token obtained from**: `/api/v1/auth/login` endpoint
- **Token refresh**: `/api/v1/auth/refresh` endpoint

## Base URL

All API endpoints use the base URL: `/api/v1`

## HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Internal Server Error

## Rate Limiting

- Standard rate limiting applies to all endpoints
- Higher limits for authenticated users
- Specific limits for search and public endpoints

## Data Formats

### Timestamps

- All timestamps are in ISO 8601 format: `2024-01-01T10:00:00`
- Unix timestamps (milliseconds) used for date fields: `1704067200000`

### Coordinates

- Latitude/Longitude in decimal degrees
- Example: `latitude: 12.9716, longitude: 77.5946`

### Currency

- All monetary values in decimal format
- Example: `price: 25.0, discountedPrice: 22.5`

### Phone Numbers

- Stored as strings with country code
- Example: `"+91XXXXXXXXXX"`

### Email Addresses

- Standard email format validation
- Case-insensitive storage

## Error Handling

### Common Error Codes

- `400`: Invalid request parameters
- `401`: Authentication required
- `403`: Insufficient permissions
- `404`: Resource not found
- `409`: Conflict (duplicate data)
- `422`: Validation errors
- `500`: Server error

### Error Response Format

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "field1": ["Error message 1", "Error message 2"],
    "field2": ["Error message"]
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

## Security Considerations

1. **Authentication**: JWT tokens with expiration
2. **Authorization**: Role-based access control
3. **Data Validation**: Input validation on all endpoints
4. **Rate Limiting**: Protection against abuse
5. **HTTPS**: All communications encrypted
6. **PII Protection**: Sensitive data masked in responses

## Support and Contact

For API support and questions:

- Technical Documentation: Refer to individual role-based documentation files
- Integration Support: Contact development team
- Bug Reports: Use issue tracking system

---

**Last Updated**: January 2024
**API Version**: 1.0.0
