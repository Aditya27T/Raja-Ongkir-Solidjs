import { createSignal, createResource } from 'solid-js';
import { apiService } from '../services/api-service';
import type { CityResponse, OngkirRequest, OngkirResponse } from '../types';

export const useOngkir = () => {
  const [cities] = createResource<CityResponse[]>(async () => {
    try {
      return await apiService.getCities();
    } catch (error) {
      console.error('Failed to fetch cities:', error);
      return [];
    }
  });
  
  const [formData, setFormData] = createSignal<OngkirRequest>({
    origin: null,
    destination: null,
    weight: null,
    courier: null
  });

  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [shippingCost, setShippingCost] = createSignal<OngkirResponse | null>(null);

  const calculateShipping = async () => {
    if (!formData().origin || !formData().destination || !formData().weight || !formData().courier) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const cost = await apiService.calculateShipping(formData());
      setShippingCost(cost);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate shipping cost');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof OngkirRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      origin: null,
      destination: null,
      weight: null,
      courier: null
    });
    setShippingCost(null);
    setError(null);
  };

  return {
    cities,
    formData,
    loading,
    error,
    shippingCost,
    calculateShipping,
    updateFormData,
    resetForm
  };
};