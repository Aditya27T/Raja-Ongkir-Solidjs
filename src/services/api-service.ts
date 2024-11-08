import axios from 'axios';

const BASE_URL = 'https://harisekeke.vercel.app/api';

export const apiService = {
  getCities: async () => {
    const response = await axios.get(`${BASE_URL}/kota`);
    return response.data;
  },

  calculateShipping: async (data: {
    origin: number | null;
    destination: number | null;
    weight: number | null;
    courier: string | null;
  }) => {
    const response = await axios.post(`${BASE_URL}/ongkir`, data);
    return response.data;
  }
};