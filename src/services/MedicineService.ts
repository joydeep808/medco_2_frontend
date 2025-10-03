import { apiInstance } from '@config/_axios/AxiosConfig';
import { ApiResponse, PaginatedResponse } from '@interfaces/response/common';

export interface Medicine {
  id: number;
  name: string;
  genericName: string;
  manufacturer: string;
  description: string;
  category: {
    id: number;
    name: string;
    description: string;
  };
  requiresPrescription: boolean;
  isActive: boolean;
  variants: MedicineVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface MedicineVariant {
  id: number;
  strength: string;
  form: string;
  packSize: number;
  price: number;
  discountedPrice: number;
  stock: number;
  expiryDate: number;
  batchNumber: string;
  isActive: boolean;
  pharmacy?: {
    id: number;
    name: string;
    distance: number;
  };
}

export interface MedicineSearchRequest {
  query?: string;
  categoryId?: number;
  pharmacyId?: number;
  minPrice?: number;
  maxPrice?: number;
  requiresPrescription?: boolean;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
}

export interface MedicineCategory {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export class MedicineService {
  private static readonly BASE_URL = '/medicines';

  static async searchMedicines(
    searchRequest: MedicineSearchRequest,
    page: number = 0,
    size: number = 20,
  ): Promise<ApiResponse<PaginatedResponse<Medicine>>> {
    return apiInstance.post(
      `${this.BASE_URL}/search?page=${page}&size=${size}`,
      searchRequest,
    );
  }

  static async getMedicineDetails(
    medicineId: number,
  ): Promise<ApiResponse<Medicine>> {
    return apiInstance.get(`${this.BASE_URL}/${medicineId}`);
  }

  static async getMedicineVariants(
    medicineId: number,
    page: number = 0,
    size: number = 20,
  ): Promise<ApiResponse<PaginatedResponse<MedicineVariant>>> {
    return apiInstance.get(
      `${this.BASE_URL}/${medicineId}/variants?page=${page}&size=${size}`,
    );
  }

  static async getMedicineVariantDetails(
    variantId: number,
  ): Promise<ApiResponse<MedicineVariant>> {
    return apiInstance.get(`${this.BASE_URL}/variants/${variantId}`);
  }

  static async getMedicineCategories(
    page: number = 0,
    size: number = 50,
  ): Promise<ApiResponse<PaginatedResponse<MedicineCategory>>> {
    return apiInstance.get(
      `${this.BASE_URL}/categories?page=${page}&size=${size}`,
    );
  }
}
