import axios, { AxiosInstance } from 'axios';


const apiClient: AxiosInstance = axios.create({
    // baseURL: 'https://jmiazr2sjf.ap-south-1.awsapprunner.com/',
     baseURL: 'http://localhost:5000/',
    //baseURL: 'https://avi4zzwxh5.ap-south-1.awsapprunner.com/',
    //baseURL: 'https://8966-113-199-230-115.ngrok-free.app',
    headers: {
        'Content-Type': 'application/json',
    },
});

const HomeService = {
  
  getUser: async (params: Record<string, unknown> = {}) => {
    try {
      const response = await apiClient.post('getUser', params);
      console.log('user', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error in getData:', error);
      throw error;
    }
  },

  updateUser: async (params: Record<string, unknown> = {}) => {
    try {
      const response = await apiClient.post('updateUser', params);
      console.log('update-user', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error in getData:', error);
      throw error;  
    }
  },

  getData: async (params: Record<string, unknown> = {}) => {
    try {
      const response = await apiClient.post('getData', params);
      console.log('resp', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error in getData:', error);
      throw error;
    }
  },

  getCarousel: async (params: Record<string, unknown> = {}) => {
    try {
      const response = await apiClient.post('retriveHSBOffers', params);
      console.log('carou resp', response.data);
      
      return response.data.offers;
    } catch (error) {
      console.error('Error in getData:', error);
      throw error;
    }
  },
    
  loginUser: async (params: Record<string, unknown> = {}) => {
    try {
      const response = await apiClient.post('newLoginUser', params);
      console.log('login resp', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error in getData:', error);
      throw error;
    }
  },
  
  confirmOTP: async (params: Record<string, unknown> = {}) => {
    try {
      const response = await apiClient.post('newConfirmOtp', params);
      console.log('login resp', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error in getData:', error);
      throw error;
    }
  },

  logUserEvent: async (params: Record<string, unknown> = {}) => {
    try {
      const response = await apiClient.post('logUserEvent', params);      
      return response.data;
    } catch (error) {
      console.error('Error in getData:', error);
      throw error;
    }
  },
  
  logUserEventWithInfo: async (params: Record<string, unknown> = {}) => {
    try {
      const response = await apiClient.post('logUserEventWithInfo', params);      
      return response.data;
    } catch (error) {
      console.error('Error in getData:', error);
      throw error;
    }
  },

  getVouchers: async (params: Record<string, unknown> = {}) => {
    try {
      const response = await apiClient.post('getHomePageNew', params);
      console.log('vocuch resp', response.data);
      
      return response.data.matching_offers;

    } catch (error) {
      console.error('Error in getData:', error);
      throw error;
    }
  },

  getDenominations: async (params: Record<string, unknown> = {}) => {
    try {
      const response = await apiClient.post('getEdenredVouchersDenominations', params);
      console.log('denom resp', response.data.vouchers);
      
      return response.data.vouchers;

    } catch (error) {
      console.error('Error in getData:', error);
      throw error;
    }
  },

  
  insertCart: async (params: Record<string, unknown> = {}) => {
    try {
      const response = await apiClient.post('upsertCartItem', params);
      console.log('denom resp', response.data);
      
      return response.data;

    } catch (error) {
      console.error('Error in getData:', error);
      throw error;
    }
  },

  getCartCount : async (params: Record<string, unknown> = {}) => {
    try {
        const response = await apiClient.post('retrieveCartItem', params);
        // console.log('cart', response.data.cart_items);
      
        return response.data.cart_items;

    } catch (error) {
        console.error("Error fetching cart count:", error);
    }
  },

  generateToken: async (params: Record<string, unknown> = {}) => {
    try {
      const response = await apiClient.post('generate-token', params);
      console.log('token', response.data.token);
      
      return response.data.token;

    } catch (error) {
      console.error('Error in getData:', error);
      throw error;
    }
  },

  insertUserOrder: async (params: Record<string, unknown> = {}) => {
    try {
      const response = await apiClient.post('insertUserOrder', params);      
      return response.data.user_order_id;

    } catch (error) {
      console.error('Error in getData:', error);
      throw error;
    }
  },

  updateUserOrder: async (params: Record<string, unknown> = {}) => {
    try {
      const response = await apiClient.post('updateUserOrder', params);      
      return response.data.user_order_id;

    } catch (error) {
      console.error('Error in getData:', error);
      throw error;
    }
  },

  processPaidOrder: async (params: Record<string, unknown> = {}) => {
    try {
      const response = await apiClient.post('processPaidOrder', params);      
      return response.data.user_order_id;

    } catch (error) {
      console.error('Error in getData:', error);
      throw error;
    }
  },

  getUserVoucher: async (params: Record<string, unknown> = {}) => {
    try {
      const response = await apiClient.post('getUserVouchers', params);      
      return response.data.user_voucher;

    } catch (error) {
      console.error('Error in getData:', error);
      throw error;
    }
  },

  searchOffers: async (params: Record<string, unknown> = {}) => {
    try {
      const response = await apiClient.post('searchOffers', params);      
      return response.data.matching_offers;

    } catch (error) {
      console.error('Error in getData:', error);
      throw error;
    }
  },
};

export default HomeService;