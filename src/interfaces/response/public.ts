// types/public.ts

import { Address, ApiResponse, PaginatedResponse, Medicine, Category, MedicineVariant } from './common';

export interface PublicMedicineVariant extends MedicineVariant {
  pharmacy: {
    id: number;
    name: string;
    distance: number;
    address?: Address;
    deliveryFee?: number;
    estimatedDeliveryTime?: number;
  };
}

export interface PublicMedicine extends Omit<Medicine, 'variants'> {
  variants: PublicMedicineVariant[];
}

export interface PublicPharmacy {
  id: number;
  name: string;
  description: string;
  licenseNumber: string;
  email: string;
  phone: string;
  address: Address;
  isOpen: boolean;
  isActive: boolean;
  status: 'APPROVED';
  rating: number;
  totalRatings: number;
  distance: number;
  deliveryRadius: number;
  minimumOrderAmount: number;
  deliveryFee: number;
  estimatedDeliveryTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface UniversalSearchResult {
  medicines: {
    id: number;
    name: string;
    genericName: string;
    manufacturer: string;
    category: string;
    price: number;
    discountedPrice: number;
    pharmacy: {
      id: number;
      name: string;
      distance: number;
    };
  }[];
  pharmacies: {
    id: number;
    name: string;
    rating: number;
    distance: number;
    deliveryFee: number;
    estimatedDeliveryTime: number;
  }[];
  totalResults: {
    medicines: number;
    pharmacies: number;
  };
}

export interface CartValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  updatedItems: any[]; // could be refined
  totalAmount: number;
}