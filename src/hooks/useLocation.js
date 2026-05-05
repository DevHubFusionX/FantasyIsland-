import { useQuery } from '@tanstack/react-query';

export const useLocation = () => {
  const { data: locationData } = useQuery({
    queryKey: ['userLocation'],
    queryFn: async () => {
      // Fallback function for IP-based detection
      const fetchByIP = async () => {
        try {
          // Attempt 1: ipapi.co
          const response = await fetch('https://ipapi.co/json/').catch(() => null);
          if (response) {
            const data = await response.json();
            if (data.city && (data.region || data.country_name)) {
              return data.region ? `${data.city}, ${data.region}` : `${data.city}, ${data.country_name}`;
            }
          }

          // Attempt 2: ip-api.com (Secondary fallback)
          const response2 = await fetch('http://ip-api.com/json/').catch(() => null);
          if (response2) {
            const data = await response2.json();
            if (data.city && data.regionName) {
              return `${data.city}, ${data.regionName}`;
            }
          }

          return 'Ibiza, Spain'; // Ultimate fallback
        } catch (error) {
          console.warn('Silent fallback for location detection:', error);
          return 'Ibiza, Spain';
        }
      };

      // Primary function for Geolocation API
      return new Promise((resolve) => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                const { latitude, longitude } = position.coords;
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
                );
                const data = await response.json();
                
                if (data.address) {
                  const city = data.address.city || data.address.town || data.address.village || data.address.suburb;
                  const region = data.address.state || data.address.country;
                  
                  if (city && region) {
                    resolve(`${city}, ${region}`);
                    return;
                  }
                }
                resolve(await fetchByIP());
              } catch (error) {
                console.warn("Geolocation successful but geocoding failed, falling back to IP:", error);
                resolve(await fetchByIP());
              }
            },
            async (error) => {
              console.warn("Geolocation permission denied or failed, falling back to IP:", error);
              resolve(await fetchByIP());
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
          );
        } else {
          resolve(fetchByIP());
        }
      });
    },
    staleTime: Infinity, // Location doesn't change often
    gcTime: Infinity
  });

  return { 
    location: locationData || 'Detecting Sanctuary...', 
    isDetected: !!locationData 
  };
};
