import { useState, useEffect } from 'react';

export const useLocation = () => {
  const [location, setLocation] = useState('Detecting Sanctuary...');
  const [isDetected, setIsDetected] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      // Step 1: Try high-accuracy Geolocation API first
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              // Step 2: Reverse Geocode using Nominatim (OpenStreetMap) - Free & No Key
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
              );
              const data = await response.json();
              
              if (data.address) {
                const city = data.address.city || data.address.town || data.address.village || data.address.suburb;
                const region = data.address.state || data.address.country;
                
                if (city && region) {
                  setLocation(`${city}, ${region}`);
                  setIsDetected(true);
                  return; // Success!
                }
              }
              // Fallback if geocoding data is weird
              throw new Error("Nominatim failed to provide city/region");
            } catch (error) {
              console.warn("Geolocation successful but geocoding failed, falling back to IP:", error);
              fetchByIP();
            }
          },
          (error) => {
            console.warn("Geolocation permission denied or failed, falling back to IP:", error);
            fetchByIP();
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        fetchByIP();
      }
    };

    const fetchByIP = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.city && (data.region || data.country_name)) {
          const locationString = data.region 
            ? `${data.city}, ${data.region}` 
            : `${data.city}, ${data.country_name}`;
          setLocation(locationString);
          setIsDetected(true);
        } else {
          setLocation('Global Access');
        }
      } catch (error) {
        console.error('Error fetching location by IP:', error);
        setLocation('Ibiza, Spain'); // Default fallover
      }
    };

    fetchLocation();
  }, []);

  return { location, isDetected };
};
