/**
 * Authentication Service
 * Handles all authentication-related API calls and business logic
 */

import { postRequest, getRequest } from '@utils/AxiosUtil';
import { setToken, removeToken } from '@store/AuthStore';
import tokenStore from '@store/TokenStore';
import { resetAndNavigateUnsafe } from '@utils/NavigationUtils';
import { NavigationGuard } from '@utils/NavigationGuard';
import { ApiResponse, JwtTokenUser } from '@interfaces/response/common';

// Request/Response interfaces
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: JwtTokenUser;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  dateOfBirth: number;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
}

export interface RegisterResponse {
  message: string;
  userId: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface VerifyOTPRequest {
  email: string;
  otp: string;
  type: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET';
}

export class AuthService {
  /**
   * Login user with email and password
   */
  static async login(
    email: string,
    password: string,
  ): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await postRequest<LoginResponse, LoginRequest>(
        '/auth/login',
        {
          email,
          password,
        },
      );

      if (response.success) {
        // Store tokens
        tokenStore.setToken('access_token', response.data.accessToken);
        tokenStore.setToken('refresh_token', response.data.refreshToken);

        // Set auth state
        setToken(response.data.accessToken);
      }

      return response;
    } catch (error) {
      return {
        success: false,
        message: 'Login failed. Please try again.',
        data: {} as LoginResponse,
        requestId: '',
        timestamp: '',
        version: '',
      };
    }
  }

  /**
   * Register new user
   */
  static async register(
    userData: RegisterRequest,
  ): Promise<ApiResponse<RegisterResponse>> {
    return postRequest<RegisterResponse, RegisterRequest>(
      '/auth/register',
      userData,
    );
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      // Call logout endpoint to invalidate token on server
      await postRequest<void, {}>('/auth/logout', {});
    } catch (error) {
      console.log('Logout API call failed, proceeding with local logout');
    } finally {
      // Always clear local state
      removeToken();
      resetAndNavigateUnsafe('LoginScreen');
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
    const refreshToken = tokenStore.getRefreshToken();

    if (!refreshToken) {
      return {
        success: false,
        message: 'No refresh token available',
        data: { accessToken: '' },
        requestId: '',
        timestamp: '',
        version: '',
      };
    }

    try {
      const response = await postRequest<
        { accessToken: string },
        { refreshToken: string }
      >('/auth/refresh', { refreshToken });

      if (response.success) {
        // Update stored token
        tokenStore.setToken('access_token', response.data.accessToken);
        setToken(response.data.accessToken);
      }

      return response;
    } catch (error) {
      // If refresh fails, logout user
      this.logout();
      return {
        success: false,
        message: 'Session expired. Please login again.',
        data: { accessToken: '' },
        requestId: '',
        timestamp: '',
        version: '',
      };
    }
  }

  /**
   * Send forgot password email
   */
  static async forgotPassword(
    email: string,
  ): Promise<ApiResponse<{ message: string }>> {
    return postRequest<{ message: string }, ForgotPasswordRequest>(
      '/auth/forgot-password',
      {
        email,
      },
    );
  }

  /**
   * Reset password with token
   */
  static async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<ApiResponse<{ message: string }>> {
    return postRequest<{ message: string }, ResetPasswordRequest>(
      '/auth/reset-password',
      {
        token,
        newPassword,
      },
    );
  }

  /**
   * Change password for authenticated user
   */
  static async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<ApiResponse<{ message: string }>> {
    return postRequest<{ message: string }, ChangePasswordRequest>(
      '/auth/change-password',
      {
        currentPassword,
        newPassword,
      },
    );
  }

  /**
   * Verify OTP for email verification or password reset
   */
  static async verifyOTP(
    email: string,
    otp: string,
    type: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET',
  ): Promise<ApiResponse<{ message: string; token?: string }>> {
    return postRequest<{ message: string; token?: string }, VerifyOTPRequest>(
      '/auth/verify-otp',
      {
        email,
        otp,
        type,
      },
    );
  }

  /**
   * Resend OTP
   */
  static async resendOTP(
    email: string,
    type: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET',
  ): Promise<ApiResponse<{ message: string }>> {
    return postRequest<{ message: string }, { email: string; type: string }>(
      '/auth/resend-otp',
      {
        email,
        type,
      },
    );
  }

  /**
   * Get current user profile
   */
  static async getProfile(): Promise<ApiResponse<JwtTokenUser>> {
    return getRequest<JwtTokenUser>('/auth/profile');
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = tokenStore.getAccessToken();
    return !!token;
  }

  /**
   * Get stored access token
   */
  static getAccessToken(): string | undefined {
    return tokenStore.getAccessToken();
  }

  /**
   * Get stored refresh token
   */
  static getRefreshToken(): string | undefined {
    return tokenStore.getRefreshToken();
  }

  /**
   * Validate token expiry and refresh if needed
   */
  static async validateAndRefreshToken(): Promise<boolean> {
    const token = this.getAccessToken();

    if (!token) {
      return false;
    }

    // Here you could add JWT token expiry validation
    // For now, we'll assume the token is valid
    // In a real app, you'd decode the JWT and check the exp claim

    try {
      // Try to get profile to validate token
      const profileResponse = await this.getProfile();

      if (profileResponse.success) {
        return true;
      } else {
        // Token might be expired, try to refresh
        const refreshResponse = await this.refreshToken();
        return refreshResponse.success;
      }
    } catch (error) {
      return false;
    }
  }

  /**
   * Navigate user to appropriate home screen based on their role
   */
  static navigateToRoleBasedHome(): void {
    NavigationGuard.navigateToRoleBasedHome();
  }

  /**
   * Validate user authentication and navigate accordingly
   */
  static async validateAndNavigate(): Promise<void> {
    const isValid = await this.validateAndRefreshToken();

    if (isValid) {
      this.navigateToRoleBasedHome();
    } else {
      resetAndNavigateUnsafe('LoginScreen');
    }
  }

  /**
   * Generate OTP for phone number
   */
  static async generateOtp(phone: string): Promise<ApiResponse<null>> {
    return postRequest<null, { phone: string }>('/auth/generate-otp', {
      phone,
    });
  }

  /**
   * Login with phone and OTP
   */
  static async loginWithOtp(
    phone: string,
    otp: string,
  ): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await postRequest<
        LoginResponse,
        { phone: string; otp: string }
      >('/auth/login', { phone, otp });

      if (response.success) {
        // Store tokens
        tokenStore.setToken('access_token', response.data.accessToken);
        tokenStore.setToken('refresh_token', response.data.refreshToken);

        // Set auth state
        setToken(response.data.accessToken);
      }

      return response;
    } catch (error) {
      return {
        success: false,
        message: 'Login failed. Please try again.',
        data: {} as LoginResponse,
        requestId: '',
        timestamp: '',
        version: '',
      };
    }
  }
}

export default AuthService;
