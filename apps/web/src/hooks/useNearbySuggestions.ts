import { useEffect, useState } from 'react';
import apiClient from '../apiClient';

export interface Suggestion {
  id: string;
  name: string;
  address: string;
  distance: number;
  eta: number;
  deliveryFee: number;
}

export function useNearbySuggestions(latitude?: number, longitude?: number) {
  const [data, setData] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (latitude == null || longitude == null) {
      return;
    }
    setLoading(true);
    apiClient
      .get('/stores/nearby', {
        params: { latitude, longitude, radiusKm: 15, limit: 6 }
      })
      .then((response) => setData(response.data))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [latitude, longitude]);

  return { data, loading };
}
