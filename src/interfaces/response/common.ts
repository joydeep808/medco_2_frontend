// types/common.ts

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string; // ISO 8601
  requestId: string; // UUID
  version: string;   // e.g., "1.0.0"
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: Record<string, unknown>;
  timestamp: string;
  requestId: string;
  version: string;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst: boolean;
  isLast: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  pagination: Pagination;
  filters: Record<string, unknown>;
}

export interface Address {
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number;
  longitude: number;
}

export interface UserBase {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: 'CUSTOMER' | 'ADMIN' | 'DELIVERY_AGENT' | 'PHARMACY_OWNER';
  dateOfBirth: number; // timestamp
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  profileImageUrl?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  lastLoginAt: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface MedicineVariant {
  id: number;
  strength: string;
  form: string;
  packSize: number;
  price: number;
  discountedPrice: number;
  stock: number;
  expiryDate: number; // timestamp
  batchNumber: string;
  isActive: boolean;
}

export interface Medicine {
  id: number;
  name: string;
  genericName: string;
  manufacturer: string;
  description: string;
  category: Category;
  requiresPrescription: boolean;
  isActive: boolean;
  variants: MedicineVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  medicine: {
    name: string;
    genericName: string;
  };
  variant: {
    strength: string;
    form: string;
    packSize: number;
  };
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}


export interface JwtTokenUser {
  userId: number;
  name:string;
  email:string;
  role:string
  status:string
  isEmailVerified:string
  isPhoneVerified:string

}