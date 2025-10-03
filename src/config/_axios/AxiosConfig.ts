import axios from 'axios';

export const apiInstance = axios.create({
  baseURL: 'http://192.168.31.67:3005/api/v1',
});
