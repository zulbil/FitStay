import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { MapPin, X } from "lucide-react";

interface ZipCodeData {
  zipCode: string;
  city: string;
  state: string;
  stateCode: string;
  lat: number;
  lng: number;
  fullAddress?: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string, addressData?: ZipCodeData) => void;
  onAddressSelected?: (addressData: ZipCodeData) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
    initGooglePlaces: () => void;
  }
}

export function AddressAutocomplete({
  value,
  onChange,
  onAddressSelected,
  placeholder = "Enter address, city, state or ZIP code...",
  label,
  className,
  disabled = false,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<ZipCodeData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const autocompleteService = useRef<any>(null);
  const geocoder = useRef<any>(null);
  const placesService = useRef<any>(null);

  // Initialize Google Maps services
  useEffect(() => {
    const initializeServices = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        try {
          autocompleteService.current = new window.google.maps.places.AutocompleteService();
          geocoder.current = new window.google.maps.Geocoder();
          
          // Create a temporary div for PlacesService (required by Google Maps API)
          const mapDiv = document.createElement('div');
          const map = new window.google.maps.Map(mapDiv, {
            center: { lat: 0, lng: 0 },
            zoom: 1
          });
          placesService.current = new window.google.maps.places.PlacesService(map);
        } catch (error) {
          console.error('Failed to initialize Google Maps services:', error);
        }
      }
    };

    // Wait for Google Maps to be available (it's loaded by GoogleMap component)
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        initializeServices();
      } else {
        setTimeout(checkGoogleMaps, 100);
      }
    };

    checkGoogleMaps();
  }, []);

  // Enhanced address lookup with Google Places API
  const fetchAddressSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    setSuggestions([]);

    try {
      // Use Google Places API if available
      if (autocompleteService.current) {
        const request = {
          input: query,
          types: ['(regions)'], // Include cities, postal codes, and regions
          componentRestrictions: { country: 'us' }
        };

        autocompleteService.current.getPlacePredictions(request, (predictions: any[], status: any) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
            // Process predictions and get detailed info
            Promise.all(
              predictions.slice(0, 5).map((prediction: any) => 
                getPlaceDetails(prediction.place_id)
              )
            ).then((results) => {
              const validResults = results.filter(Boolean) as ZipCodeData[];
              setSuggestions(validResults);
              setShowSuggestions(validResults.length > 0);
              setIsLoading(false);
            }).catch(() => {
              // Fallback to ZIP code lookup
              fallbackZipCodeLookup(query);
            });
          } else {
            // Fallback to ZIP code lookup
            fallbackZipCodeLookup(query);
          }
        });
      } else {
        // Fallback if Google Places not available
        fallbackZipCodeLookup(query);
      }
    } catch (error) {
      console.error('Address lookup error:', error);
      fallbackZipCodeLookup(query);
    }
  };

  // Get detailed place information
  const getPlaceDetails = (placeId: string): Promise<ZipCodeData | null> => {
    return new Promise((resolve) => {
      if (!placesService.current) {
        resolve(null);
        return;
      }

      const request = {
        placeId: placeId,
        fields: ['address_components', 'geometry', 'formatted_address']
      };

      placesService.current.getDetails(request, (place: any, status: any) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const addressData = parseGooglePlace(place);
          resolve(addressData);
        } else {
          resolve(null);
        }
      });
    });
  };

  // Parse Google Place to our ZipCodeData format
  const parseGooglePlace = (place: any): ZipCodeData | null => {
    let city = '';
    let state = '';
    let stateCode = '';
    let zipCode = '';

    // Parse address components
    place.address_components.forEach((component: any) => {
      const types = component.types;
      
      if (types.includes('locality')) {
        city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        state = component.long_name;
        stateCode = component.short_name;
      } else if (types.includes('postal_code')) {
        zipCode = component.long_name;
      }
    });

    // If we don't have a city, try sublocality or neighborhood
    if (!city) {
      place.address_components.forEach((component: any) => {
        const types = component.types;
        if (types.includes('sublocality') || types.includes('neighborhood')) {
          city = component.long_name;
        }
      });
    }

    if (!city || !state) {
      return null;
    }

    return {
      zipCode: zipCode || '',
      city,
      state,
      stateCode,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      fullAddress: place.formatted_address
    };
  };

  // Fallback to Zippopotam API for ZIP codes
  const fallbackZipCodeLookup = async (query: string) => {
    try {
      // Try ZIP code lookup first (if query is numeric)
      if (/^\d{2,5}$/.test(query)) {
        const response = await fetch(`https://api.zippopotam.us/us/${query}`);
        if (response.ok) {
          const data = await response.json();
          const zipSuggestion: ZipCodeData = {
            zipCode: data['post code'],
            city: data.places[0]['place name'],
            state: data.places[0]['state'],
            stateCode: data.places[0]['state abbreviation'],
            lat: parseFloat(data.places[0]['latitude']),
            lng: parseFloat(data.places[0]['longitude']),
            fullAddress: `${data.places[0]['place name']}, ${data.places[0]['state abbreviation']} ${data['post code']}`
          };
          setSuggestions([zipSuggestion]);
          setShowSuggestions(true);
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      console.error('Fallback lookup failed:', error);
    }
    
    setSuggestions([]);
    setShowSuggestions(false);
    setIsLoading(false);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Debounce the API calls
    const timeoutId = setTimeout(() => {
      fetchAddressSuggestions(newValue);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: ZipCodeData) => {
    const displayText = suggestion.fullAddress || 
      `${suggestion.city}, ${suggestion.stateCode}${suggestion.zipCode ? ' ' + suggestion.zipCode : ''}`;
    
    onChange(displayText, suggestion);
    setShowSuggestions(false);
    
    if (onAddressSelected) {
      onAddressSelected(suggestion);
    }
  };

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Clear input
  const handleClear = () => {
    onChange('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative", className)}>
      {label && (
        <Label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </Label>
      )}
      
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full pl-10 pr-10"
        />
        
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.lat}-${suggestion.lng}-${index}`}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {suggestion.fullAddress || 
                     `${suggestion.city}, ${suggestion.stateCode}${suggestion.zipCode ? ' ' + suggestion.zipCode : ''}`}
                  </div>
                  {suggestion.zipCode && (
                    <div className="text-xs text-gray-500">
                      ZIP: {suggestion.zipCode}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}