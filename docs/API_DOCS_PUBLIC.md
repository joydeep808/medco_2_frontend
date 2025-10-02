# Public API Documentation

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
- **Response**:

```json
{
  "success": true,
  "message": "Medicine variants retrieved successfully",
  "data": {
    "content": [
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
          "address": {
            "street": "123 Pharmacy St",
            "city": "City",
            "pincode": "12345"
          },
          "distance": 2.5,
          "deliveryFee": 25.0,
          "estimatedDeliveryTime": 30
        }
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

### 4. Get Medicine Variant Details

- **Route**: `GET /medicines/variants/{variantId}`
- **Method**: GET
- **Response**: Same structure as single variant in Get Medicine Variants

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

## Cart Management (Customer Only)

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
    "pharmacy": {
      "id": 1,
      "name": "ABC Pharmacy",
      "deliveryFee": 25.0,
      "minimumOrderAmount": 100.0,
      "estimatedDeliveryTime": 30
    },
    "items": [
      {
        "id": 1,
        "medicine": {
          "id": 1,
          "name": "Paracetamol",
          "genericName": "Acetaminophen"
        },
        "variant": {
          "id": 1,
          "strength": "500mg",
          "form": "TABLET",
          "packSize": 10
        },
        "quantity": 2,
        "unitPrice": 25.0,
        "discountedPrice": 22.5,
        "totalPrice": 45.0,
        "addedAt": "2024-01-01T10:00:00"
      }
    ],
    "subtotal": 45.0,
    "deliveryFee": 25.0,
    "discountAmount": 0.0,
    "couponDiscount": 0.0,
    "totalAmount": 70.0,
    "appliedCoupon": null,
    "itemCount": 1,
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
  "variantId": 1,
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

### 5. Apply Coupon

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

### 6. Validate Cart

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
    "totalAmount": 70.0
  },
  "timestamp": "2024-01-01T10:00:00",
  "requestId": "uuid",
  "version": "1.0.0"
}
```
