/**
 * Location Service
 * Handles geolocation, address management, and location-based operations
 */

import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { getRequest, postRequest } from '@utils/AxiosUtil';
import { ApiResponse } from '@interfaces/response/common';
import axios from 'axios';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp?: number;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  accuracy?: number;
  timestamp: number;
}

export interface SavedAddress {
  id: string;
  label: string;
  location: LocationData;
  isDefault: boolean;
  type: 'HOME' | 'WORK' | 'OTHER';
  deliveryInstructions?: string;
  landmark?: string;
}

export interface AddressSearchResult {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  location?: LocationCoordinates;
}

export interface GeocodeResponse {
  address: string;
  area: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  formattedAddress: string;
}

export enum LocationErrorType {
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  LOCATION_UNAVAILABLE = 'LOCATION_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  NETWORK_ERROR = 'NETWORK_ERROR',
  GEOCODING_FAILED = 'GEOCODING_FAILED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface LocationError {
  type: LocationErrorType;
  message: string;
  code?: number;
  recoverable: boolean;
  retryAction?: () => void;
}

export class LocationService {
  private static watchId: number | null = null;
  private static lastKnownLocation: LocationData | null = null;

  /**
   * Request location permissions
   */
  static async requestLocationPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'MedCo needs access to your location to find nearby pharmacies and provide accurate delivery services.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // iOS permissions handled by Info.plist
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  }

  /**
   * Get current location
   */
  static async getCurrentLocation(): Promise<LocationData> {
    return new Promise(async (resolve, reject) => {
      const hasPermission = await this.requestLocationPermission();

      if (!hasPermission) {
        reject({
          type: LocationErrorType.PERMISSION_DENIED,
          message:
            'Location permission denied. Please enable location access in settings.',
          recoverable: true,
          retryAction: () => this.getCurrentLocation(),
        } as LocationError);
        return;
      }

      Geolocation.getCurrentPosition(
        async position => {
          try {
            const { latitude, longitude, accuracy } = position.coords;
            const geocodeResult = await this.reverseGeocode(
              latitude,
              longitude,
            );

            const locationData: LocationData = {
              latitude,
              longitude,
              accuracy,
              timestamp: Date.now(),
              ...geocodeResult,
            };

            this.lastKnownLocation = locationData;
            resolve(locationData);
          } catch (geocodeError) {
            // If geocoding fails, still return coordinates
            const locationData: LocationData = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              address: 'Unknown Address',
              area: 'Unknown Area',
              city: 'Unknown City',
              state: 'Unknown State',
              pincode: '000000',
              country: 'India',
              timestamp: Date.now(),
            };

            this.lastKnownLocation = locationData;
            resolve(locationData);
          }
        },
        error => {
          let locationError: LocationError;

          switch (error.code) {
            case 1: // PERMISSION_DENIED
              locationError = {
                type: LocationErrorType.PERMISSION_DENIED,
                message:
                  'Location access denied. Please enable location permissions.',
                code: error.code,
                recoverable: true,
                retryAction: () => this.getCurrentLocation(),
              };
              break;
            case 2: // POSITION_UNAVAILABLE
              locationError = {
                type: LocationErrorType.LOCATION_UNAVAILABLE,
                message:
                  'Location unavailable. Please check your GPS settings.',
                code: error.code,
                recoverable: true,
                retryAction: () => this.getCurrentLocation(),
              };
              break;
            case 3: // TIMEOUT
              locationError = {
                type: LocationErrorType.TIMEOUT,
                message: 'Location request timed out. Please try again.',
                code: error.code,
                recoverable: true,
                retryAction: () => this.getCurrentLocation(),
              };
              break;
            default:
              locationError = {
                type: LocationErrorType.UNKNOWN_ERROR,
                message: 'Unable to get location. Please try again.',
                code: error.code,
                recoverable: true,
                retryAction: () => this.getCurrentLocation(),
              };
          }

          reject(locationError);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    });
  }

  /**
   * Watch location changes
   */
  static async watchLocation(
    onLocationUpdate: (location: LocationData) => void,
    onError: (error: LocationError) => void,
  ): Promise<boolean> {
    const hasPermission = await this.requestLocationPermission();

    if (!hasPermission) {
      onError({
        type: LocationErrorType.PERMISSION_DENIED,
        message: 'Location permission required for live tracking.',
        recoverable: true,
      });
      return false;
    }

    this.watchId = Geolocation.watchPosition(
      async position => {
        try {
          const { latitude, longitude, accuracy } = position.coords;
          const geocodeResult = await this.reverseGeocode(latitude, longitude);

          const locationData: LocationData = {
            latitude,
            longitude,
            accuracy,
            timestamp: Date.now(),
            ...geocodeResult,
          };

          this.lastKnownLocation = locationData;
          onLocationUpdate(locationData);
        } catch (error) {
          onError({
            type: LocationErrorType.GEOCODING_FAILED,
            message: 'Failed to get address for location.',
            recoverable: true,
          });
        }
      },
      error => {
        onError({
          type: LocationErrorType.LOCATION_UNAVAILABLE,
          message: 'Location tracking failed.',
          code: error.code,
          recoverable: true,
        });
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10, // Update every 10 meters
        interval: 5000, // Update every 5 seconds
        fastestInterval: 2000,
      },
    );

    return true;
  }

  /**
   * Stop watching location
   */
  static stopWatchingLocation(): void {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  /**
   * Reverse geocode coordinates to address using Ola Maps
   */
  static async reverseGeocode(
    latitude: number,
    longitude: number,
  ): Promise<GeocodeResponse> {
    try {
      // Use Ola Maps reverse geocoding
      const location = { lat: latitude, lng: longitude };
      const currentLocationInfo = await this.getUserCurrentLocationInfo(
        location,
      );

      if (currentLocationInfo) {
        // Parse the formatted address to extract components
        const addressParts = currentLocationInfo.formatted_address.split(', ');

        return {
          address:
            currentLocationInfo.name || addressParts[0] || 'Unknown Address',
          area: addressParts[1] || 'Unknown Area',
          city: addressParts[2] || 'Unknown City',
          state: addressParts[3] || 'Unknown State',
          pincode:
            this.extractPincode(currentLocationInfo.formatted_address) ||
            '000000',
          country: 'India',
          formattedAddress: currentLocationInfo.formatted_address,
        };
      } else {
        throw new Error('Reverse geocoding failed');
      }
    } catch (error) {
      console.error('Ola Maps reverse geocoding error:', error);
      // Fallback to basic address format
      return {
        address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        area: 'Unknown Area',
        city: 'Unknown City',
        state: 'Unknown State',
        pincode: '000000',
        country: 'India',
        formattedAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      };
    }
  }

  /**
   * Forward geocode address to coordinates
   */
  static async geocodeAddress(address: string): Promise<LocationCoordinates[]> {
    try {
      const response = await getRequest<LocationCoordinates[]>(
        `/location/geocode?address=${encodeURIComponent(address)}`,
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      throw {
        type: LocationErrorType.GEOCODING_FAILED,
        message: 'Failed to find location for the given address.',
        recoverable: true,
      } as LocationError;
    }
  }

  /**
   * Search for addresses with autocomplete using Ola Maps
   */
  static async searchAddresses(query: string): Promise<AddressSearchResult[]> {
    try {
      const results = await this.autoComplete(query);

      if (results && results.predictions) {
        return results.predictions.map((prediction: any) => ({
          placeId: prediction.place_id,
          description: prediction.description,
          mainText:
            prediction.structured_formatting?.main_text ||
            prediction.description,
          secondaryText: prediction.structured_formatting?.secondary_text || '',
          location: prediction.geometry
            ? {
                latitude: prediction.geometry.location.lat,
                longitude: prediction.geometry.location.lng,
              }
            : undefined,
        }));
      }

      return [];
    } catch (error) {
      console.error('Ola Maps address search error:', error);
      return [];
    }
  }

  /**
   * Get address details by place ID
   */
  static async getAddressDetails(placeId: string): Promise<LocationData> {
    try {
      const response = await getRequest<LocationData>(
        `/location/place-details?placeId=${placeId}`,
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      throw {
        type: LocationErrorType.GEOCODING_FAILED,
        message: 'Failed to get address details.',
        recoverable: true,
      } as LocationError;
    }
  }

  /**
   * Calculate distance between two points
   */
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Get last known location
   */
  static getLastKnownLocation(): LocationData | null {
    return this.lastKnownLocation;
  }

  /**
   * Ola Maps API configuration
   */
  private static readonly OLA_API_KEY =
    'IcJ1kHYannayv3ngvSqUBpuWjggPFIET6nAB8CUu';
  private static readonly olaMapAxiosInstance = axios.create({
    baseURL: 'https://api.olamaps.io/places/v1/',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * Ola Maps autocomplete
   */
  static async autoComplete(text: string): Promise<any> {
    try {
      const location = await this.getUserLocation();
      const url = `autocomplete?location=${location?.coords.latitude},${
        location?.coords.longitude
      }&radius=500&strictbounds=false&api_key=${
        this.OLA_API_KEY
      }&input=${encodeURIComponent(text)}`;
      return await this.olaGetRequest(url);
    } catch (error) {
      console.error('Ola Maps autocomplete error:', error);
      return null;
    }
  }

  /**
   * Get current location info using Ola Maps
   */
  static async getUserCurrentLocationInfo(location: {
    lat: number;
    lng: number;
  }): Promise<any> {
    try {
      const url = `reverse-geocode?latlng=${location.lat},${location.lng}&api_key=${this.OLA_API_KEY}`;
      const res = await this.olaGetRequest(url);

      if (res && res!.status === 'ok' && res.results && res.results.length > 0) {
        const result = res.results[0];
        return {
          formatted_address: result.formatted_address,
          geometry: result.geometry,
          name: result.name,
          place_id: result.place_id,
        };
      }
      return null;
    } catch (error) {
      console.error('Ola Maps reverse geocode error:', error);
      return null;
    }
  }

  /**
   * Ola Maps GET request
   */
  static async olaGetRequest<T>(url: string): Promise<T | null> {
    try {
      const response = await this.olaMapAxiosInstance.get<T>(url);
      return response.data;
    } catch (error) {
      console.error('Ola Maps API error:', error);
      return null;
    }
  }

  /**
   * Get user location for Ola Maps
   */
  static async getUserLocation(): Promise<{
    coords: { latitude: number; longitude: number };
  } | null> {
    try {
      const location = await this.getCurrentLocation();
      return {
        coords: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Extract pincode from formatted address
   */
  static extractPincode(address: string): string | null {
    const pincodeRegex = /\b\d{6}\b/;
    const match = address.match(pincodeRegex);
    return match ? match[0] : null;
  }

  /**
   * Check if location services are enabled
   */
  static async isLocationEnabled(): Promise<boolean> {
    return new Promise(resolve => {
      Geolocation.getCurrentPosition(
        () => resolve(true),
        () => resolve(false),
        { timeout: 1000, maximumAge: 0 },
      );
    });
  }

  /**
   * Show location settings dialog
   */
  static showLocationSettingsDialog(): void {
    Alert.alert(
      'Location Required',
      'Please enable location services to find nearby pharmacies and get accurate delivery estimates.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Settings',
          onPress: () => {
            // Open device settings - this would need a native module
            console.log('Open location settings');
          },
        },
      ],
    );
  }

  /**
   * Format address for display
   */
  static formatAddress(location: LocationData, short: boolean = false): string {
    if (short) {
      return `${location.area}, ${location.city}`;
    }

    return `${location.address}, ${location.area}, ${location.city}, ${location.state} ${location.pincode}`;
  }

  /**
   * Validate coordinates
   */
  static isValidCoordinates(latitude: number, longitude: number): boolean {
    return (
      latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180
    );
  }
}

export default LocationService;
