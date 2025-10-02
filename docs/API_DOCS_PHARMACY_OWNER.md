# Pharmacy Owner API Documentation

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

## Pharmacy Management

### 1. Get My Pharmacy

- **Route**: `GET /pharmacies/status`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Response**:

```json
{
  "success": true,
  "message": "Pharmacy details retrieved successfully",
  "data": {
    "id": 1,
    "name": "ABC Pharmacy",
    "description": "Your trusted pharmacy",
    "licenseNumber": "LIC123456",
    "email": "[email]",
    "phone": "[phone_number]",
    "address": {
      "street": "123 Pharmacy St",
      "area": "Medical District",
      "city": "City",
      "state": "State",
      "pincode": "12345",
      "latitude": 12.9716,
      "longitude": 77.5946
    },
    "isOpen": true,
    "isActive": true,
    "status": "APPROVED",
    "rating": 4.5,
    "totalRatings": 150,
    "deliveryRadius": 10,
    "minimumOrderAmount": 100.0,
    "deliveryFee": 25.0,
    "estimatedDeliveryTime": 30,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 2. Update Pharmacy Status (Open/Closed)

- **Route**: `PUT /pharmacies/update/isOpen`
- **Method**: PUT
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `isOpen=true`
- **Response**:

```json
{
  "success": true,
  "message": "Pharmacy status updated successfully",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 3. Update Pharmacy Details

- **Route**: `PUT /pharmacies/update`
- **Method**: PUT
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:

```json
{
  "name": "ABC Pharmacy",
  "description": "Your trusted pharmacy",
  "phone": "[phone_number]",
  "deliveryRadius": 10,
  "minimumOrderAmount": 100.0,
  "deliveryFee": 25.0,
  "estimatedDeliveryTime": 30
}
```

- **Response**: Same as Get My Pharmacy

## Medicine Management

### 1. Get My Medicines

- **Route**: `GET /medicines/my`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `page=0&size=20`
- **Response**:

```json
{
  "success": true,
  "message": "Medicines retrieved successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "name": "Paracetamol",
        "genericName": "Acetaminophen",
        "manufacturer": "ABC Pharma",
        "description": "Pain reliever and fever reducer",
        "category": {
          "id": 1,
          "name": "Pain Relief",
          "description": "Medicines for pain management"
        },
        "requiresPrescription": false,
        "isActive": true,
        "variants": [
          {
            "id": 1,
            "strength": "500mg",
            "form": "TABLET",
            "packSize": 10,
            "price": 25.0,
            "discountedPrice": 22.5,
            "stock": 100,
            "expiryDate": 1735689600000,
            "batchNumber": "BATCH123",
            "isActive": true
          }
        ],
        "createdAt": "2024-01-01T10:00:00",
        "updatedAt": "2024-01-01T10:00:00"
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

### 2. Add Medicine

- **Route**: `POST /medicines/add`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:

```json
{
  "name": "Paracetamol",
  "genericName": "Acetaminophen",
  "manufacturer": "ABC Pharma",
  "description": "Pain reliever and fever reducer",
  "categoryId": 1,
  "requiresPrescription": false,
  "variants": [
    {
      "strength": "500mg",
      "form": "TABLET",
      "packSize": 10,
      "price": 25.0,
      "discountedPrice": 22.5,
      "stock": 100,
      "expiryDate": 1735689600000,
      "batchNumber": "BATCH123"
    }
  ]
}
```

- **Response**: Same structure as single medicine in Get My Medicines

### 3. Update Medicine

- **Route**: `PUT /medicines/{medicineId}`
- **Method**: PUT
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: Same as Add Medicine
- **Response**: Same structure as single medicine

### 4. Delete Medicine

- **Route**: `DELETE /medicines/{medicineId}`
- **Method**: DELETE
- **Headers**: `Authorization: Bearer <token>`
- **Response**:

```json
{
  "success": true,
  "message": "Medicine deleted successfully",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 5. Update Stock

- **Route**: `POST /medicines/my/variants/{variantId}/stock`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:

```json
{
  "stock": 150,
  "operation": "SET"
}
```

- **Response**:

```json
{
  "success": true,
  "message": "Stock updated successfully",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

## Order Management

### 1. Get Pharmacy Orders

- **Route**: `GET /orders/pharmacy`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `page=0&size=20&status=PENDING`
- **Response**:

```json
{
  "success": true,
  "message": "Orders retrieved successfully",
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
        "status": "PENDING",
        "totalAmount": 275.0,
        "deliveryFee": 25.0,
        "discountAmount": 0.0,
        "finalAmount": 275.0,
        "paymentStatus": "PAID",
        "paymentMethod": "RAZORPAY",
        "deliveryAddress": {
          "street": "123 Main St",
          "area": "Downtown",
          "city": "City",
          "pincode": "12345",
          "latitude": 12.9716,
          "longitude": 77.5946
        },
        "items": [
          {
            "id": 1,
            "medicine": {
              "name": "Paracetamol",
              "genericName": "Acetaminophen"
            },
            "variant": {
              "strength": "500mg",
              "form": "TABLET",
              "packSize": 10
            },
            "quantity": 10,
            "unitPrice": 25.0,
            "totalPrice": 250.0
          }
        ],
        "estimatedDeliveryTime": "2024-01-01T11:00:00",
        "createdAt": "2024-01-01T10:00:00",
        "updatedAt": "2024-01-01T10:00:00"
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
    "filters": {
      "status": "PENDING"
    }
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 2. Accept Order

- **Route**: `POST /orders/{orderNumber}/accept`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Response**:

```json
{
  "success": true,
  "message": "Order accepted successfully",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 3. Reject Order

- **Route**: `POST /orders/{orderNumber}/reject`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `reason=Out of stock`
- **Response**:

```json
{
  "success": true,
  "message": "Order rejected successfully",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 4. Mark Order Ready

- **Route**: `POST /orders/{orderNumber}/ready`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Response**:

```json
{
  "success": true,
  "message": "Order marked as ready for pickup",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 5. Get Order Details

- **Route**: `GET /orders/{orderNumber}`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Same structure as single order in Get Pharmacy Orders

## Analytics

### 1. Get Pharmacy Analytics

- **Route**: `GET /pharmacies/my/analytics`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `period=MONTHLY&startDate=1704067200000&endDate=1706745600000`
- **Response**:

```json
{
  "success": true,
  "message": "Analytics retrieved successfully",
  "data": {
    "totalOrders": 150,
    "totalRevenue": 45000.0,
    "averageOrderValue": 300.0,
    "completedOrders": 140,
    "cancelledOrders": 10,
    "topMedicines": [
      {
        "medicineId": 1,
        "medicineName": "Paracetamol",
        "totalQuantity": 500,
        "totalRevenue": 12500.0
      }
    ],
    "revenueByDate": [
      {
        "date": "2024-01-01",
        "revenue": 1500.0,
        "orders": 5
      }
    ],
    "customerDemographics": {
      "totalCustomers": 75,
      "newCustomers": 15,
      "returningCustomers": 60
    },
    "period": {
      "startDate": "2024-01-01",
      "endDate": "2024-01-31"
    }
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 2. Get Pharmacy Dashboard

- **Route**: `GET /analytics/pharmacy/dashboard`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Response**:

```json
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "todayOrders": 5,
    "todayRevenue": 1500.0,
    "pendingOrders": 3,
    "lowStockItems": 8,
    "totalMedicines": 250,
    "activeCustomers": 45,
    "averageRating": 4.5,
    "recentOrders": [
      {
        "orderNumber": "ORD-2024-001",
        "customerName": "John Doe",
        "amount": 275.0,
        "status": "PENDING",
        "createdAt": "2024-01-01T10:00:00"
      }
    ]
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

## Medicine Categories

### 1. Get Categories

- **Route**: `GET /medicines/categories`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `page=0&size=50`
- **Response**:

```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "name": "Pain Relief",
        "description": "Medicines for pain management",
        "isActive": true,
        "createdAt": "2024-01-01T10:00:00"
      }
    ],
    "pagination": {
      "page": 0,
      "size": 50,
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
