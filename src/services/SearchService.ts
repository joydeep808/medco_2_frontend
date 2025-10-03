import { apiInstance } from '@config/_axios/AxiosConfig';
import { ApiResponse } from '@interfaces/response/common';

export interface UniversalSearchRequest {
  query: string;
  type: 'ALL' | 'MEDICINE' | 'PHARMACY';
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  filters?: {
    minPrice?: number;
    maxPrice?: number;
    requiresPrescription?: boolean;
  };
}

export interface SearchMedicine {
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
}

export interface SearchPharmacy {
  id: number;
  name: string;
  rating: number;
  distance: number;
  deliveryFee: number;
  estimatedDeliveryTime: number;
}

export interface UniversalSearchResponse {
  medicines: SearchMedicine[];
  pharmacies: SearchPharmacy[];
  totalResults: {
    medicines: number;
    pharmacies: number;
  };
}

export class SearchService {
  private static readonly BASE_URL = '/search';

  static async universalSearch(
    request: UniversalSearchRequest,
  ): Promise<ApiResponse<UniversalSearchResponse>> {
    return apiInstance.post(`${this.BASE_URL}`, request);
  }

  static async getSearchSuggestions(
    query: string,
    type: 'MEDICINE' | 'PHARMACY' = 'MEDICINE',
  ): Promise<ApiResponse<string[]>> {
    return apiInstance.get(
      `${this.BASE_URL}/suggestions?query=${encodeURIComponent(
        query,
      )}&type=${type}`,
    );
  }

  static async getTrendingSearches(): Promise<ApiResponse<string[]>> {
    return apiInstance.get(`${this.BASE_URL}/trending`);
  }
}
