import axios from 'axios';

export const httpClient = axios.create();

httpClient.interceptors.request.use((config) => {
  if (config.url?.startsWith('api:'))
    config.url = config.url.replace('api:', 'https://api.example.com/');
  return config;
});
