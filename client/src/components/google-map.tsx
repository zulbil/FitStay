import { useEffect, useRef } from "react";
import type { Coach } from "@shared/schema";

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface GoogleMapProps {
  coaches: Coach[];
  onCoachMarkerClick?: (coach: Coach) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

export function GoogleMap({ 
  coaches, 
  onCoachMarkerClick, 
  center = { lat: 39.8283, lng: -98.5795 }, // Center of USA
  zoom = 4,
  className = "h-96 w-full rounded-lg"
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      window.initMap = initializeMap;
      document.head.appendChild(script);
      
      return () => {
        document.head.removeChild(script);
      };
    } else {
      initializeMap();
    }
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMarkers();
    }
  }, [coaches]);

  const initializeMap = () => {
    if (!mapRef.current) return;

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      zoom,
      center,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }]
        }
      ]
    });

    updateMarkers();
  };

  const updateMarkers = () => {
    if (!mapInstanceRef.current || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add markers for coaches with locations
    coaches.forEach(coach => {
      if (coach.lat && coach.lng) {
        const marker = new window.google.maps.Marker({
          position: { lat: Number(coach.lat), lng: Number(coach.lng) },
          map: mapInstanceRef.current,
          title: coach.headline,
          icon: {
            url: 'data:image/svg+xml;base64,' + btoa(`
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF385C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
            anchor: new window.google.maps.Point(16, 32)
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold;">${coach.headline}</h3>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${coach.city}, ${coach.country}</p>
              <p style="margin: 0 0 8px 0; font-size: 12px;">${coach.specialties.join(', ')}</p>
              <p style="margin: 0; font-size: 12px; font-weight: bold;">$${coach.pricePerHour}/hour</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
          if (onCoachMarkerClick) {
            onCoachMarkerClick(coach);
          }
        });

        markersRef.current.push(marker);
      }
    });

    // Adjust map bounds if there are markers
    if (markersRef.current.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      markersRef.current.forEach(marker => {
        bounds.extend(marker.getPosition());
      });
      
      if (markersRef.current.length === 1) {
        mapInstanceRef.current.setCenter(bounds.getCenter());
        mapInstanceRef.current.setZoom(12);
      } else {
        mapInstanceRef.current.fitBounds(bounds);
        
        // Ensure minimum zoom level
        const listener = window.google.maps.event.addListener(mapInstanceRef.current, 'bounds_changed', () => {
          if (mapInstanceRef.current.getZoom() > 15) {
            mapInstanceRef.current.setZoom(15);
          }
          window.google.maps.event.removeListener(listener);
        });
      }
    }
  };

  return <div ref={mapRef} className={className} />;
}