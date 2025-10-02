# Delivery Agent API Documentation

## Base URL

`/api/v1`

## Common Response Format

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

## Common Error Response

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

## Authentication Endpoints

_Same as Customer API - refer to Customer documentation_

## Availability Management

### 1. Update Availability

- **Route**: `POST /delivery-agent/availability`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `available=true`
- **Response**:

```json
{
  "success": true,
  "message": "Availability updated to available",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 2. Get Availability Status

- **Route**: `GET /delivery-agent/availability`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Response**:

```json
{
  "success": true,
  "message": "Availability status retrieved",
  "data": true,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 3. Update Location

- **Route**: `POST /delivery-agent/location`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `latitude=12.9716&longitude=77.5946`
- **Response**:

```json
{
  "success": true,
  "message": "Location updated successfully",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

## Order Management

### 1. Get Available Orders

- **Route**: `GET /orders/available`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `page=0&size=20`
- **Response**:

```json
{
  "success": true,
  "message": "Available orders retrieved successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "orderNumber": "ORD-2024-001",
        "customer": {
          "id": 1,
          "firstName": "John",
          "lastName": "Doe",
          "phone": "[phone_number]"
        },
        "pharmacy": {
          "id": 1,
          "name": "ABC Pharmacy",
          "phone": "[phone_number]",
          "address": {
            "street": "123 Pharmacy St",
            "area": "Medical District",
            "city": "City",
            "pincode": "12345",
            "latitude": 12.9716,
            "longitude": 77.5946
          }
        },
        "status": "READY_FOR_PICKUP",
        "totalAmount": 275.0,
        "deliveryFee": 25.0,
        "finalAmount": 275.0,
        "deliveryAddress": {
          "street": "123 Main St",
          "area": "Downtown",
          "city": "City",
          "pincode": "12345",
          "latitude": 12.9716,
          "longitude": 77.5946
        },
        "distance": 5.2,
        "estimatedDeliveryTime": "2024-01-01T11:00:00",
        "createdAt": "2024-01-01T10:00:00"
      }
    ],
    "pagination": {
      "page": 0,
      "size": 20,
      "totalElements": 1,
      "totalPages": 1,
      "hasNext": false,
      "hasPrevious": false,
      "isFirst": true,
      "isLast": true
    },
    "filters": {}
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 2. Get My Deliveries

- **Route**: `GET /orders/deliveries`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `page=0&size=20&status=ASSIGNED`
- **Response**: Same structure as Get Available Orders

### 3. Get Order Details

- **Route**: `GET /orders/{orderNumber}`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Same structure as single order in Get Available Orders

## Delivery Assignment Management

### 1. Accept Assignment

- **Route**: `POST /delivery/assignments/{orderNumber}/accept`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Response**:

```json
{
  "success": true,
  "message": "Assignment accepted successfully",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 2. Reject Assignment

- **Route**: `POST /delivery/assignments/{orderNumber}/reject`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `reason=Too far from current location`
- **Response**:

```json
{
  "success": true,
  "message": "Assignment rejected successfully",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 3. Mark Order Picked Up

- **Route**: `POST /delivery/assignments/{orderNumber}/pickup`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Response**:

```json
{
  "success": true,
  "message": "Order marked as picked up",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 4. Mark Out for Delivery

- **Route**: `POST /delivery/assignments/{orderNumber}/out-for-delivery`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Response**:

```json
{
  "success": true,
  "message": "Order marked as out for delivery",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 5. Mark Order Delivered

- **Route**: `POST /delivery/assignments/{orderNumber}/delivered`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `deliveryProofUrl=https://example.com/proof.jpg` (optional)
- **Response**:

```json
{
  "success": true,
  "message": "Order marked as delivered",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 6. Mark Delivery Failed

- **Route**: `POST /delivery/assignments/{orderNumber}/failed`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `failureReason=Customer not available`
- **Response**:

```json
{
  "success": true,
  "message": "Delivery marked as failed",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

## Analytics

### 1. Get Delivery Agent Dashboard

- **Route**: `GET /analytics/delivery/dashboard`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Response**:

```json
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "todayDeliveries": 8,
    "todayEarnings": 200.0,
    "pendingPickups": 2,
    "completedDeliveries": 6,
    "totalDistance": 45.5,
    "averageRating": 4.7,
    "currentStatus": "AVAILABLE",
    "recentDeliveries": [
      {
        "orderNumber": "ORD-2024-001",
        "customerName": "John Doe",
        "deliveryFee": 25.0,
        "status": "DELIVERED",
        "completedAt": "2024-01-01T10:30:00"
      }
    ],
    "weeklyEarnings": [
      {
        "date": "2024-01-01",
        "earnings": 200.0,
        "deliveries": 8
      }
    ]
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

## User Profile Endpoints

_Same as Customer API - refer to Customer documentation for profile management_
