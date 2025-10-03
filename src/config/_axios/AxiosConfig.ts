import tokenStore from '@store/TokenStore';
import axios from 'axios';

export const apiInstance = axios.create({
  baseURL: 'http://10.153.235.98:3005/api/v1',
});

// Request interceptor to add auth token
apiInstance.interceptors.request.use(config => {
  const token = tokenStore.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiInstance.interceptors.response.use(async confg => {
  return confg.data;
});
