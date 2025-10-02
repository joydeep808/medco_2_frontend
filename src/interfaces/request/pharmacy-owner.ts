// requests/pharmacy-owner.ts

// Pharmacy
export interface UpdatePharmacyStatusQuery {
  isOpen: boolean;
}

export interface UpdatePharmacyDetailsRequest {
  name: string;
  description: string;
  phone: string;
  deliveryRadius: number;
  minimumOrderAmount: number;
  deliveryFee: number;
  estimatedDeliveryTime: number;
}

// Medicine
export interface MedicineVariantInput {
  strength: string;
  form: string;
  packSize: number;
  price: number;
  discountedPrice: number;
  stock: number;
  expiryDate: number; // timestamp
  batchNumber: string;
}

export interface AddMedicineRequest {
  name: string;
  genericName: string;
  manufacturer: string;
  description: string;
  categoryId: number;
  requiresPrescription: boolean;
  variants: MedicineVariantInput[];
}

export interface UpdateMedicineRequest extends AddMedicineRequest {
  id: number;
}

export interface UpdateStockRequest {
  stock: number;
  operation: 'SET' | 'INCREASE' | 'DECREASE';
}

// Order
export interface RejectOrderQuery {
  reason: string;
}