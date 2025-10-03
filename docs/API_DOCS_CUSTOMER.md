# Customer API Documentation

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

### 1. Register User

- **Route**: `POST /auth/register`
- **Method**: POST
- **Request Body**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "[email]",
  "phone": "[phone_number]",
  "password": "password123",
  "role": "CUSTOMER"
}
```

- **Response**:

```json
{
  "success": true,
  "message": "Registration successful",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 2. Generate OTP

- **Route**: `POST /auth/generate-otp`
- **Method**: POST
- **Request Body**:

```json
{
  "phone": "[phone_number]"
}
```

- **Response**:

```json
{
  "success": true,
  "message": "OTP sent successfully",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 3. Login

- **Route**: `POST /auth/login`
- **Method**: POST
- **Request Body**:

```json
{
  "mobile": "",
  "otp": "123456"
}
```

- **Response**:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 4. Refresh Token

- **Route**: `GET /auth/refresh`
- **Method**: GET
- **Query Params**: `refreshToken=token`
- **Response**:

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "new_jwt_token_here",
    "refreshToken": "new_refresh_token_here"
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 5. Logout

- **Route**: `POST /auth/logout`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Response**:

```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 6. Change Password

- **Route**: `POST /auth/change-password`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:

```json
{
  "currentPassword": "oldpass",
  "newPassword": "newpass"
}
```

- **Response**:

```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 7. Forgot Password

- **Route**: `POST /auth/forgot-password`
- **Method**: POST
- **Request Body**:

```json
{
  "email": "[email]"
}
```

- **Response**:

```json
{
  "success": true,
  "message": "Reset link sent to email",
  "data": {
    "verificationMethod": "EMAIL",
    "expiresIn": 900
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 8. Reset Password

- **Route**: `POST /auth/reset-password`
- **Method**: POST
- **Request Body**:

```json
{
  "token": "reset_token",
  "newPassword": "newpass"
}
```

- **Response**:

```json
{
  "success": true,
  "message": "Password reset successfully",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

## User Profile Endpoints

### 1. Get Profile

- **Route**: `GET /users/profile`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Response**:

```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
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
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 2. Update Profile

- **Route**: `PUT /users/profile`
- **Method**: PUT
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "[phone_number]",
  "dateOfBirth": 946684800000,
  "gender": "MALE"
}
```

- **Response**: Same as Get Profile

### 3. Upload Profile Image

- **Route**: `POST /users/profile/image`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Content-Type**: `multipart/form-data`
- **Request Body**: `file` (image file)
- **Response**:

```json
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "data": {
    "imageUrl": "https://example.com/new-image.jpg"
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

## Address Management

### 1. Get All Addresses

- **Route**: `GET /addresses`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `page=0&size=20`
- **Response**:

```json
{
  "success": true,
  "message": "Addresses retrieved successfully",
  "data": {
    "content": [
      {
        "id": "addr_123",
        "label": "Home",
        "street": "123 Main St",
        "area": "Downtown",
        "city": "City",
        "state": "State",
        "pincode": "12345",
        "landmark": "Near Park",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "type": "HOME",
        "isDefault": true,
        "deliveryInstructions": "Ring the bell",
        "createdAt": 1704067200000
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

### 2. Add Address

- **Route**: `POST /addresses`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:

```json
{
  "label": "Home",
  "street": "123 Main St",
  "area": "Downtown",
  "city": "City",
  "state": "State",
  "pincode": "12345",
  "landmark": "Near Park",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "type": "HOME",
  "isDefault": false,
  "deliveryInstructions": "Ring the bell"
}
```

- **Response**:

```json
{
  "success": true,
  "message": "Address added successfully",
  "data": {
    "id": "addr_123",
    "label": "Home",
    "street": "123 Main St",
    "area": "Downtown",
    "city": "City",
    "state": "State",
    "pincode": "12345",
    "landmark": "Near Park",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "type": "HOME",
    "isDefault": false,
    "deliveryInstructions": "Ring the bell",
    "createdAt": 1704067200000
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 3. Update Address

- **Route**: `PUT /addresses/{addressId}`
- **Method**: PUT
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: Same as Add Address
- **Response**: Same as Add Address

### 4. Delete Address

- **Route**: `DELETE /addresses/{addressId}`
- **Method**: DELETE
- **Headers**: `Authorization: Bearer <token>`
- **Response**:

```json
{
  "success": true,
  "message": "Address deleted successfully",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 5. Set Default Address

- **Route**: `POST /addresses/{addressId}/set-default`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Response**:

```json
{
  "success": true,
  "message": "Default address updated successfully",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

## Cart Management

### 1. Get Cart by Pharmacy

- **Route**: `GET /cart/{cartId}`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Response**:

```json
{
  "success": true,
  "message": "Cart retrieved successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "items": [
      {
        "id": 1,
        "medicineVariantId": 1,
        "medicineName": "Paracetamol",
        "medicineImage": "https://example.com/paracetamol.jpg",
        "variantName": "500mg Tablet",
        "pharmacyId": 1,
        "pharmacyName": "ABC Pharmacy",
        "quantity": 2,
        "mrp": 30.0,
        "sellingPrice": 25.0,
        "totalMrp": 60.0,
        "totalPrice": 50.0,
        "discount": 5.0,
        "totalDiscount": 10.0,
        "gstRate": 12.0,
        "gstAmount": 6.0,
        "itemFinalAmount": 56.0,
        "savings": 10.0,
        "stockQuantity": 100,
        "isAvailable": true,
        "addedAt": "2024-01-01T10:00:00",
        "updatedAt": "2024-01-01T10:00:00"
      }
    ],
    "subtotal": 50.0,
    "totalMrp": 60.0,
    "totalDiscount": 10.0,
    "totalQuantity": 2,
    "couponCode": "SAVE20",
    "couponDiscount": 10.0,
    "finalAmount": 66.0,
    "gstAmount": 6.0,
    "gstRate": 12.0,
    "freeDeliveryThreshold": 200.0,
    "totalSavings": 20.0,
    "deliveryCharge": 25.0,
    "minOrderAmount": 100.0,
    "isFreeDeliveryEligible": false,
    "createdAt": "2024-01-01T10:00:00",
    "updatedAt": "2024-01-01T10:00:00"
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 2. Add to Cart

- **Route**: `POST /cart/add`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:

```json
{
  "medicineVariantId": 1,
  "quantity": 2,
  "pharmacyId": 1
}
```

- **Response**: Same structure as Get Cart

### 3. Update Cart Item

- **Route**: `PUT /cart/update`
- **Method**: PUT
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:

```json
{
  "cartItemId": 1,
  "quantity": 3
}
```

- **Response**: Same structure as Get Cart

### 4. Remove from Cart

- **Route**: `DELETE /cart/remove`
- **Method**: DELETE
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:

```json
{
  "cartItemId": 1
}
```

- **Response**: Same structure as Get Cart

### 5. Clear Cart

- **Route**: `DELETE /cart`
- **Method**: DELETE
- **Headers**: `Authorization: Bearer <token>`
- **Response**:

```json
{
  "success": true,
  "message": "Cart cleared successfully",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 6. Apply Coupon

- **Route**: `POST /cart/apply`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:

```json
{
  "cartId": 1,
  "couponCode": "SAVE20"
}
```

- **Response**: Same structure as Get Cart with applied coupon

### 7. Remove Coupon

- **Route**: `DELETE /cart/remove/{cartId}`
- **Method**: DELETE
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Same structure as Get Cart without coupon

### 8. Validate Cart

- **Route**: `POST /cart/validate/{cartId}`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Response**:

```json
{
  "success": true,
  "message": "Cart validation completed",
  "data": {
    "isValid": true,
    "errors": [],
    "warnings": ["Item 'Paracetamol 500mg' has only 5 units left in stock"],
    "updatedItems": [],
    "totalAmount": 66.0
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

## Order Management

### 1. Checkout

- **Route**: `POST /orders/checkout`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:

```json
{
  "cartId": 1,
  "deliveryAddressId": "addr_123",
  "paymentMethod": "RAZORPAY",
  "deliverySlot": "10:00-12:00",
  "deliveryInstructions": "Ring the bell",
  "specialInstructions": "Handle with care",
  "prescriptionImages": ["https://example.com/prescription1.jpg"]
}
```

- **Response**:

```json
{
  "success": true,
  "message": "Checkout successful",
  "data": {
    "orderId": "order_123",
    "orderNumber": "ORD-2024-001",
    "pharmacyId": 1,
    "pharmacyName": "ABC Pharmacy",
    "subtotal": 50.0,
    "deliveryFee": 25.0,
    "packagingFee": 5.0,
    "cgst": 3.0,
    "sgst": 3.0,
    "totalAmount": 86.0,
    "couponDiscount": 10.0,
    "offerDiscount": 0.0,
    "couponCode": "SAVE20",
    "totalDiscount": 10.0,
    "paymentGatewayOrderId": "pay_123",
    "razorpayOrderId": "order_razorpay_123",
    "paymentStatus": "PENDING",
    "orderDate": 1704067200000,
    "estimatedDeliveryTime": 30,
    "deliverySlot": "10:00-12:00",
    "deliveryInstructions": "Ring the bell",
    "specialInstructions": "Handle with care"
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 2. Verify Payment

- **Route**: `POST /orders/verify-payment`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:

```json
{
  "orderId": "order_123",
  "paymentId": "pay_123",
  "signature": "signature_hash"
}
```

- **Response**: Same structure as Get Order Details

### 3. Get My Orders

- **Route**: `GET /orders/my`
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
        "id": "order_123",
        "orderNumber": "ORD-2024-001",
        "userId": 1,
        "pharmacyId": 1,
        "pharmacyName": "ABC Pharmacy",
        "deliveryAddressId": "addr_123",
        "subtotal": 50.0,
        "totalMrp": 60.0,
        "totalDiscount": 10.0,
        "deliveryFee": 25.0,
        "minimumOrderFee": 0.0,
        "packagingFee": 5.0,
        "cgst": 3.0,
        "sgst": 3.0,
        "totalTax": 6.0,
        "totalAmount": 86.0,
        "couponDiscount": 10.0,
        "offerDiscount": 0.0,
        "totalSavings": 20.0,
        "totalQuantity": 2,
        "couponCode": "SAVE20",
        "pharmacyAddress": "123 Pharmacy St, City",
        "pharmacyPhone": "[phone_number]",
        "deliveryAddress": "123 Main St, City",
        "paymentMethod": "RAZORPAY",
        "paymentStatus": "PAID",
        "paymentTransactionId": "txn_123",
        "status": "PENDING",
        "orderDate": 1704067200000,
        "confirmedAt": null,
        "preparedAt": null,
        "pickedUpAt": null,
        "deliveredAt": null,
        "cancelledAt": null,
        "deliveryAgentId": null,
        "deliveryAgentName": null,
        "deliveryAgentPhone": null,
        "estimatedDeliveryTime": 30,
        "actualDeliveryTime": null,
        "deliverySlot": "10:00-12:00",
        "deliveryInstructions": "Ring the bell",
        "prescriptionImages": ["https://example.com/prescription1.jpg"],
        "prescriptionVerified": false,
        "prescriptionVerifiedBy": null,
        "specialInstructions": "Handle with care",
        "pharmacyNotes": null,
        "cancellationReason": null,
        "cancellationNotes": null,
        "cancelledBy": null,
        "rating": null,
        "pharmacyRating": null,
        "deliveryRating": null,
        "reviewComment": null,
        "reviewDate": null,
        "items": [
          {
            "id": 1,
            "medicineVariantId": 1,
            "medicineName": "Paracetamol",
            "medicineImage": "https://example.com/paracetamol.jpg",
            "variantName": "500mg Tablet",
            "manufacturer": "ABC Pharma",
            "quantity": 2,
            "mrp": 30.0,
            "sellingPrice": 25.0,
            "totalMrp": 60.0,
            "totalSellingPrice": 50.0,
            "discount": 5.0,
            "totalDiscount": 10.0,
            "specialInstructions": null,
            "prescriptionRequired": false
          }
        ],
        "createdAt": 1704067200000,
        "updatedAt": 1704067200000
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

### 4. Get Order Details

- **Route**: `GET /orders/{orderNumber}`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Same structure as single order in Get My Orders

### 5. Cancel Order

- **Route**: `POST /orders/{orderNumber}/cancel`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:

```json
{
  "reason": "Changed my mind",
  "notes": "No longer needed"
}
```

- **Response**:

```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": null,
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 6. Reorder

- **Route**: `POST /orders/{orderNumber}/reorder`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Same structure as single order in Get My Orders

## Coupon Management

### 1. Get Active Coupons

- **Route**: `GET /coupons/active`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `page=0&size=20`
- **Response**:

```json
{
  "success": true,
  "message": "Active coupons retrieved successfully",
  "data": {
    "content": [
      {
        "id": 1,
        "code": "SAVE20",
        "title": "Save 20%",
        "description": "Get 20% off on your order",
        "type": "PERCENTAGE",
        "discountValue": 20.0,
        "maxDiscountAmount": 200.0,
        "minOrderAmount": 100.0,
        "validFrom": 1704067200000,
        "validUntil": 1706745600000,
        "isActive": true,
        "isExpired": false,
        "isValid": true,
        "totalUsageLimit": 1000,
        "usagePerUserLimit": 1,
        "currentUsageCount": 45,
        "remainingUsage": 955,
        "applicableZones": [1, 2, 3],
        "applicablePharmacies": [],
        "applicableCategories": [],
        "userUsageCount": 0,
        "canUserUse": true,
        "calculatedDiscount": 0.0,
        "discountText": "Save up to ₹200",
        "createdAt": 1704067200000,
        "updatedAt": 1704067200000
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

### 2. Get Coupon by Code

- **Route**: `GET /coupons/code/{code}`
- **Method**: GET
- **Headers**: `Authorization: Bearer <token>`
- **Response**: Same structure as single coupon in Get Active Coupons

### 3. Validate Coupon

- **Route**: `POST /coupons/validate`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:

```json
{
  "couponCode": "SAVE20",
  "cartId": 1,
  "orderAmount": 150.0
}
```

- **Response**:

```json
{
  "success": true,
  "message": "Coupon validation successful",
  "data": {
    "isValid": true,
    "couponCode": "SAVE20",
    "discountAmount": 30.0,
    "finalAmount": 120.0,
    "message": "Coupon applied successfully",
    "errors": []
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 4. Apply Coupon to Cart

- **Route**: `POST /coupons/apply/{cartId}`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `couponCode=SAVE20`
- **Response**: Same structure as Validate Coupon

## Medicine Search & Discovery

### 1. Search Medicines

- **Route**: `POST /medicines/search`
- **Method**: POST
- **Request Body**:

```json
{
  "query": "paracetamol",
  "categoryId": 1,
  "pharmacyId": 1,
  "minPrice": 10.0,
  "maxPrice": 100.0,
  "requiresPrescription": false,
  "latitude": 12.9716,
  "longitude": 77.5946,
  "radiusKm": 10
}
```

- **Query Params**: `page=0&size=20`
- **Response**:

```json
{
  "success": true,
  "message": "Medicines found successfully",
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
            "isActive": true,
            "pharmacy": {
              "id": 1,
              "name": "ABC Pharmacy",
              "distance": 2.5
            }
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
    "filters": {
      "query": "paracetamol",
      "categoryId": 1
    }
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 2. Get Medicine Details

- **Route**: `GET /medicines/{medicineId}`
- **Method**: GET
- **Response**: Same structure as single medicine in Search Medicines

### 3. Get Medicine Variants

- **Route**: `GET /medicines/{medicineId}/variants`
- **Method**: GET
- **Query Params**: `page=0&size=20`
- **Response**: Same structure as variants array in medicine details

### 4. Get Medicine Variant Details

- **Route**: `GET /medicines/variants/{variantId}`
- **Method**: GET
- **Response**: Same structure as single variant

## Pharmacy Search & Discovery

### 1. Search Pharmacies

- **Route**: `POST /pharmacies/search`
- **Method**: POST
- **Request Body**:

```json
{
  "query": "ABC Pharmacy",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "radiusKm": 10,
  "isOpen": true,
  "minRating": 4.0,
  "hasDelivery": true
}
```

- **Query Params**: `page=0&size=20`
- **Response**:

```json
{
  "success": true,
  "message": "Pharmacies found successfully",
  "data": {
    "content": [
      {
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
        "distance": 2.5,
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
      "query": "ABC Pharmacy",
      "isOpen": true
    }
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 2. Get Nearby Pharmacies

- **Route**: `GET /pharmacies/nearby`
- **Method**: GET
- **Query Params**: `latitude=12.9716&longitude=77.5946&radiusKm=10&page=0&size=20`
- **Response**: Same structure as Search Pharmacies

### 3. Get Pharmacy Details

- **Route**: `GET /pharmacies/{pharmacyId}`
- **Method**: GET
- **Response**: Same structure as single pharmacy in Search Pharmacies

## Universal Search

### 1. Universal Search

- **Route**: `POST /search`
- **Method**: POST
- **Request Body**:

```json
{
  "query": "paracetamol",
  "type": "ALL",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "radiusKm": 10,
  "filters": {
    "minPrice": 10.0,
    "maxPrice": 100.0,
    "requiresPrescription": false
  }
}
```

- **Response**:

```json
{
  "success": true,
  "message": "Search completed successfully",
  "data": {
    "medicines": [
      {
        "id": 1,
        "name": "Paracetamol",
        "genericName": "Acetaminophen",
        "manufacturer": "ABC Pharma",
        "category": "Pain Relief",
        "price": 25.0,
        "discountedPrice": 22.5,
        "pharmacy": {
          "id": 1,
          "name": "ABC Pharmacy",
          "distance": 2.5
        }
      }
    ],
    "pharmacies": [
      {
        "id": 1,
        "name": "ABC Pharmacy",
        "rating": 4.5,
        "distance": 2.5,
        "deliveryFee": 25.0,
        "estimatedDeliveryTime": 30
      }
    ],
    "totalResults": {
      "medicines": 1,
      "pharmacies": 1
    }
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 2. Get Search Suggestions

- **Route**: `GET /search/suggestions`
- **Method**: GET
- **Query Params**: `query=para&type=MEDICINE`
- **Response**:

```json
{
  "success": true,
  "message": "Suggestions retrieved successfully",
  "data": [
    "Paracetamol",
    "Paracetamol 500mg",
    "Paracetamol Tablet",
    "Paracetamol Syrup"
  ],
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

### 3. Get Trending Searches

- **Route**: `GET /search/trending`
- **Method**: GET
- **Response**:

```json
{
  "success": true,
  "message": "Trending searches retrieved successfully",
  "data": ["Paracetamol", "Crocin", "Dolo 650", "Vitamin D3", "Omeprazole"],
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```

## Analytics (Customer)

### 1. Get User Order Analytics

- **Route**: `POST /analytics/user/orders`
- **Method**: POST
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:

```json
{
  "startDate": 1704067200000,
  "endDate": 1706745600000,
  "period": "MONTHLY"
}
```

- **Response**:

```json
{
  "success": true,
  "message": "User analytics retrieved successfully",
  "data": {
    "totalOrders": 25,
    "totalSpent": 7500.0,
    "averageOrderValue": 300.0,
    "totalSavings": 1250.0,
    "completedOrders": 23,
    "cancelledOrders": 2,
    "favoritePharmacies": [
      {
        "pharmacyId": 1,
        "pharmacyName": "ABC Pharmacy",
        "orderCount": 15,
        "totalSpent": 4500.0
      }
    ],
    "topMedicines": [
      {
        "medicineId": 1,
        "medicineName": "Paracetamol",
        "orderCount": 8,
        "totalQuantity": 20
      }
    ],
    "spendingByMonth": [
      {
        "month": "2024-01",
        "amount": 2500.0,
        "orders": 8
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
