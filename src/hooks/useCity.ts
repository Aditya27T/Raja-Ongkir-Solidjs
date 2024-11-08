import { createSignal, createEffect } from 'solid-js';
import { apiService } from '../services/api-service';

const useCity = () => {
  const [city, setCity] = createSignal([]);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal(null);

  const fetchCity = async () => {
    setLoading(true);
    try {
      const response = await apiService.getCities();
      console.log(response);
      setCity(response.rajaongkir.results);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  
  createEffect(() => {
    fetchCity();
  });

  return { 
    city: city,       
    fetchCity,
    loading: loading, 
    error: error      
  };
};

export default useCity;