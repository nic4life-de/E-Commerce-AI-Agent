import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const analyzeShop = (storeType = 'shopify') => {
  return apiClient.post('/api/analyze-shop', null, {
    params: { store_type: storeType }
  });
};

export const findMarketOpportunities = (productKeyword) => {
  return apiClient.post('/api/market-opportunities', null, {
    params: { product_keyword: productKeyword }
  });
};

export const healthCheck = () => {
  return apiClient.get('/api/health');
};

export default apiClient;
