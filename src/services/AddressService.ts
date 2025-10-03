import { apiInstance } from '@config/_axios/AxiosConfig';
import { ApiResponse, PaginatedResponse } from '@interfaces/response/common';

export interface Address {
  id: string;
  label: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  latitude: number;
  longitude: number;
  type: 'HOME' | 'WORK' | 'OTHER';
  isDefault: boolean;
  deliveryInstructions: string;
  createdAt: number;
}

export interface AddAddressRequest {
  label: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  latitude: number;
  longitude: number;
  type: 'HOME' | 'WORK' | 'OTHER';
  isDefault: boolean;
  deliveryInstructions: string;
}

export class AddressService {
  private static readonly BASE_URL = '/addresses';

  static async getAllAddresses(
    page: number = 0,
    size: number = 20,
  ): Promise<ApiResponse<PaginatedResponse<Address>>> {
    return apiInstance.get(`${this.BASE_URL}?page=${page}&size=${size}`);
  }

  static async addAddress(
    request: AddAddressRequest,
  ): Promise<ApiResponse<Address>> {
    return apiInstance.post(`${this.BASE_URL}`, request);
  }

  static async updateAddress(
    addressId: string,
    request: AddAddressRequest,
  ): Promise<ApiResponse<Address>> {
    return apiInstance.put(`${this.BASE_URL}/${addressId}`, request);
  }

  static async deleteAddress(addressId: string): Promise<ApiResponse<null>> {
    return apiInstance.delete(`${this.BASE_URL}/${addressId}`);
  }

  static async setDefaultAddress(
    addressId: string,
  ): Promise<ApiResponse<null>> {
    return apiInstance.post(`${this.BASE_URL}/${addressId}/set-default`);
  }
}
