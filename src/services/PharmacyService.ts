import { apiInstance } from '@config/_axios/AxiosConfig';
import { ApiResponse, PaginatedResponse } from '@interfaces/response/common';

export interface Pharmacy {
  id: number;
  name: string;
  description: string;
  licenseNumber: string;
  email: string;
  phone: string;
  address: {
    street: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    latitude: number;
    longitude: number;
  };
  isOpen: boolean;
  isActive: boolean;
  status: string;
  rating: number;
  totalRatings: number;
  distance?: number;
  deliveryRadius: number;
  minimumOrderAmount: number;
  deliveryFee: number;
  estimatedDeliveryTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface PharmacySearchRequest {
  query?: string;
  latitude: number;
  longitude: number;
  radiusKm?: number;
  isOpen?: boolean;
  minRating?: number;
  hasDelivery?: boolean;
}

export class PharmacyService {
  private static readonly BASE_URL = '/pharmacies';

  static async searchPharmacies(
    searchRequest: PharmacySearchRequest,
    page: number = 0,
    size: number = 20,
  ): Promise<ApiResponse<PaginatedResponse<Pharmacy>>> {
    return apiInstance.post(
      `${this.BASE_URL}/search?page=${page}&size=${size}`,
      searchRequest,
    );
  }

  static async getNearbyPharmacies(
    latitude: number,
    longitude: number,
    radiusKm: number = 10,
    page: number = 0,
    size: number = 20,
  ): Promise<ApiResponse<PaginatedResponse<Pharmacy>>> {
    return apiInstance.get(
      `${this.BASE_URL}/nearby?latitude=${latitude}&longitude=${longitude}&radiusKm=${radiusKm}&page=${page}&size=${size}`,
    );
  }

  static async getPharmacyDetails(
    pharmacyId: number,
  ): Promise<ApiResponse<Pharmacy>> {
    return apiInstance.get(`${this.BASE_URL}/${pharmacyId}`);
  }
}
