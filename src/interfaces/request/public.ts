// requests/public.ts

import { Coordinates } from './common';

// Medicine Search
export interface SearchMedicinesRequest extends Coordinates {
  query?: string;
  categoryId?: number;
  pharmacyId?: number;
  minPrice?: number;
  maxPrice?: number;
  requiresPrescription?: boolean;
  radiusKm?: number;
}

// Pharmacy Search
export interface SearchPharmaciesRequest extends Coordinates {
  query?: string;
  radiusKm?: number;
  isOpen?: boolean;
  minRating?: number;
  hasDelivery?: boolean;
}

// Universal Search
export interface UniversalSearchFilters {
  minPrice?: number;
  maxPrice?: number;
  requiresPrescription?: boolean;
}

export interface UniversalSearchRequest extends Coordinates {
  query: string;
  type: 'ALL' | 'MEDICINE' | 'PHARMACY';
  radiusKm?: number;
  filters?: UniversalSearchFilters;
}

// Search Suggestions
export interface SearchSuggestionsQuery {
  query: string;
  type: 'MEDICINE' | 'PHARMACY';
}

// Cart (used in public context for validation, but auth required — still defined here for completeness)
export interface ValidateCartRequest {}