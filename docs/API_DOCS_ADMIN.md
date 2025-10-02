# Admin API Documentation

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

## User Management

### 1. Get All Users

- **Route**: `GET /users/admin`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `page=0&size=20&role=CUSTOMER&status=ACTIVE`
- **Response**:

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "[email]",
        "phoneNumber": "[phone_number]",
        "role": "CUSTOMER",
        "dateOfBirth": 946684800000,
        "gender": "MALE",
        "profileImageUrl": "https://example.com/image.jpg",
        "isActive": true,
        "isEmailVerified": true,
        "isPhoneVerified": true,
        "lastLoginAt": 1704067200000,
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
      "role": "CUSTOMER",
      "status": "ACTIVE"
    }
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 2. Get User by ID

- **Route**: `GET /users/admin/{userId}`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Same structure as single user in Get All Users

### 3. Update User Status

- **Route**: `POST /users/admin/{userId}/status`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `status=INACTIVE`
- **Response**:

```json
{
  "success": true,
  "message": "User status updated successfully",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

## Pharmacy Management

### 1. Get All Pharmacies

- **Route**: `GET /pharmacies/admin`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `page=0&size=20&status=PENDING`
- **Response**:

```json
{
  "success": true,
  "message": "Pharmacies retrieved successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "name": "ABC Pharmacy",
        "description": "Your trusted pharmacy",
        "licenseNumber": "LIC123456",
        "email": "[email]",
        "phone": "[phone_number]",
        "owner": {
          "id": 2,
          "firstName": "Jane",
          "lastName": "Smith",
          "email": "[email]",
          "phone": "[phone_number]"
        },
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
        "status": "PENDING",
        "rating": 4.5,
        "totalRatings": 150,
        "deliveryRadius": 10,
        "minimumOrderAmount": 100.0,
        "deliveryFee": 25.0,
        "estimatedDeliveryTime": 30,
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

### 2. Approve Pharmacy

- **Route**: `POST /pharmacies/admin/{pharmacyId}/approve`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Response**:

```json
{
  "success": true,
  "message": "Pharmacy approved successfully",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 3. Reject Pharmacy

- **Route**: `POST /pharmacies/admin/{pharmacyId}/reject`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `reason=Invalid license`
- **Response**:

```json
{
  "success": true,
  "message": "Pharmacy rejected successfully",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 4. Update Pharmacy

- **Route**: `PUT /pharmacies/admin/{pharmacyId}`
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

- **Response**: Same structure as single pharmacy in Get All Pharmacies

## Order Management

### 1. Get All Orders

- **Route**: `GET /orders/admin/all`
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
          "phone": "[phone_number]",
          "email": "[email]"
        },
        "pharmacy": {
          "id": 1,
          "name": "ABC Pharmacy",
          "phone": "[phone_number]",
          "address": {
            "street": "123 Pharmacy St",
            "city": "City",
            "pincode": "12345"
          }
        },
        "deliveryAgent": {
          "id": 1,
          "firstName": "Mike",
          "lastName": "Wilson",
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

### 2. Get Order Details

- **Route**: `GET /orders/{orderNumber}`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Same structure as single order in Get All Orders

## Coupon Management

### 1. Create Coupon

- **Route**: `POST /coupons/create`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:

```json
{
  "code": "SAVE20",
  "name": "Save 20%",
  "description": "Get 20% off on your order",
  "type": "PERCENTAGE",
  "value": 20.0,
  "minimumOrderAmount": 100.0,
  "maximumDiscountAmount": 200.0,
  "usageLimit": 1000,
  "userUsageLimit": 1,
  "validFrom": 1704067200000,
  "validUntil": 1706745600000,
  "isActive": true
}
```

- **Response**:

```json
{
  "success": true,
  "message": "Coupon created successfully",
  "data": {
    "id": 1,
    "code": "SAVE20",
    "name": "Save 20%",
    "description": "Get 20% off on your order",
    "type": "PERCENTAGE",
    "value": 20.0,
    "minimumOrderAmount": 100.0,
    "maximumDiscountAmount": 200.0,
    "usageLimit": 1000,
    "userUsageLimit": 1,
    "usedCount": 0,
    "validFrom": 1704067200000,
    "validUntil": 1706745600000,
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 2. Get All Coupons

- **Route**: `GET /coupons/admin`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `page=0&size=20&status=ACTIVE`
- **Response**:

```json
{
  "success": true,
  "message": "Coupons retrieved successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "code": "SAVE20",
        "name": "Save 20%",
        "description": "Get 20% off on your order",
        "type": "PERCENTAGE",
        "value": 20.0,
        "minimumOrderAmount": 100.0,
        "maximumDiscountAmount": 200.0,
        "usageLimit": 1000,
        "userUsageLimit": 1,
        "usedCount": 45,
        "validFrom": 1704067200000,
        "validUntil": 1706745600000,
        "isActive": true,
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
      "status": "ACTIVE"
    }
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 3. Update Coupon

- **Route**: `PUT /coupons/admin/{couponId}`
- **Method**: PUT
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: Same as Create Coupon
- **Response**: Same structure as Create Coupon

### 4. Deactivate Coupon

- **Route**: `POST /coupons/admin/{couponId}/deactivate`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Response**:

```json
{
  "success": true,
  "message": "Coupon deactivated successfully",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 5. Get Coupon Usage Stats

- **Route**: `GET /coupons/admin/{couponId}/stats`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Response**:

```json
{
  "success": true,
  "message": "Coupon stats retrieved successfully",
  "data": {
    "totalUsage": 45,
    "totalDiscount": 2250.0,
    "uniqueUsers": 40,
    "usageByDate": [
      {
        "date": "2024-01-01",
        "usage": 5,
        "discount": 250.0
      }
    ],
    "topUsers": [
      {
        "userId": 1,
        "userName": "John Doe",
        "usageCount": 1,
        "totalDiscount": 50.0
      }
    ]
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

## Analytics

### 1. Get Admin Dashboard

- **Route**: `GET /analytics/admin/dashboard`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Response**:

```json
{
  "success": true,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "totalUsers": 1250,
    "totalPharmacies": 85,
    "totalDeliveryAgents": 45,
    "totalOrders": 5420,
    "totalRevenue": 1625000.0,
    "todayOrders": 125,
    "todayRevenue": 37500.0,
    "pendingPharmacyApprovals": 8,
    "activeDeliveryAgents": 32,
    "averageOrderValue": 300.0,
    "platformCommission": 162500.0,
    "userGrowth": [
      {
        "date": "2024-01-01",
        "newUsers": 25,
        "totalUsers": 1250
      }
    ],
    "revenueByDate": [
      {
        "date": "2024-01-01",
        "revenue": 37500.0,
        "orders": 125
      }
    ],
    "topPharmacies": [
      {
        "pharmacyId": 1,
        "pharmacyName": "ABC Pharmacy",
        "totalOrders": 450,
        "totalRevenue": 135000.0
      }
    ]
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 2. Get Platform Analytics

- **Route**: `GET /analytics/admin/platform`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `period=MONTHLY&startDate=1704067200000&endDate=1706745600000`
- **Response**:

```json
{
  "success": true,
  "message": "Platform analytics retrieved successfully",
  "data": {
    "totalOrders": 5420,
    "totalRevenue": 1625000.0,
    "totalUsers": 1250,
    "totalPharmacies": 85,
    "totalDeliveryAgents": 45,
    "averageOrderValue": 300.0,
    "orderCompletionRate": 92.5,
    "customerRetentionRate": 68.5,
    "revenueGrowth": 15.2,
    "userGrowth": 12.8,
    "topCategories": [
      {
        "categoryId": 1,
        "categoryName": "Pain Relief",
        "totalOrders": 1250,
        "totalRevenue": 375000.0
      }
    ],
    "geographicDistribution": [
      {
        "city": "Bangalore",
        "orders": 2150,
        "revenue": 645000.0,
        "pharmacies": 35
      }
    ],
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

## Delivery Assignment Management

### 1. Manually Assign Delivery Agent

- **Route**: `POST /delivery/orders/{orderNumber}/assign/{deliveryAgentId}`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Response**:

```json
{
  "success": true,
  "message": "Delivery agent assigned successfully",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```
