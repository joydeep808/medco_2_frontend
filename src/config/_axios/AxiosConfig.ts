import tokenStore from '@store/TokenStore';
import { removeToken, setToken } from '@store/AuthStore';
import { showErrorToast } from '@components/Toast/ToastManager';
import { resetAndNavigateUnsafe } from '@utils/NavigationUtils';
import axios, { AxiosError } from 'axios';

export const apiInstance = axios.create({
  baseURL: 'http://192.168.31.67:3005/api/v1',
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor to add auth token
apiInstance.interceptors.request.use(
  async config => {
    const token = tokenStore.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle token refresh
apiInstance.interceptors.response.use(
  response => {
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiInstance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenStore.getRefreshToken();

      if (!refreshToken) {
        // No refresh token, redirect to login
        processQueue(error, null);
        removeToken();
        showErrorToast('Session expired. Please login again.');
        resetAndNavigateUnsafe('LoginScreen');
        return Promise.reject(error);
      }

      try {
        // Attempt to refresh token
        const response = await axios.post(
          `${apiInstance.defaults.baseURL}/auth/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } },
        );

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        // Store new tokens
        tokenStore.setToken('access_token', accessToken);
        tokenStore.setToken('refresh_token', newRefreshToken);
        setToken(accessToken);

        // Process queued requests
        processQueue(null, accessToken);

        // Retry original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return apiInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        processQueue(refreshError, null);
        removeToken();
        showErrorToast('Session expired. Please login again.');
        resetAndNavigateUnsafe('LoginScreen');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
