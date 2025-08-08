import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ZipCodeData {
  zipCode: string;
  city: string;
  state: string;
  stateCode: string;
  lat: number;
  lng: number;
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

export function AddressAutocomplete({
  value,
  onChange,
  onAddressSelected,
  placeholder = "Enter ZIP code or city, state...",
  label,
  className,
  disabled = false,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<ZipCodeData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Free ZIP code lookup using Zippopotam.us API
  const fetchZipSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Try ZIP code lookup first (if query is numeric)
      if (/^\d{2,5}$/.test(query)) {
        try {
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
            };
            setSuggestions([zipSuggestion]);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          console.log('ZIP code not found, trying city search');
        }
      }

      // Try city/state lookup
      const parts = query.toLowerCase().split(',').map(p => p.trim());
      if (parts.length >= 2) {
        const [city, stateQuery] = parts;
        // Common state abbreviations for quick lookup
        const states = [
          'al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'fl', 'ga',
          'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky', 'la', 'me', 'md',
          'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh', 'nj',
          'nm', 'ny', 'nc', 'nd', 'oh', 'ok', 'or', 'pa', 'ri', 'sc',
          'sd', 'tn', 'tx', 'ut', 'vt', 'va', 'wa', 'wv', 'wi', 'wy'
        ];
        
        const matchedState = states.find(s => 
          s === stateQuery.toLowerCase() || 
          stateQuery.toLowerCase().includes(s)
        );
        
        if (matchedState) {
          try {
            const response = await fetch(
              `https://api.zippopotam.us/us/${matchedState}/${encodeURIComponent(city)}`
            );
            if (response.ok) {
              const data = await response.json();
              const citySuggestions: ZipCodeData[] = data.places.map((place: any) => ({
                zipCode: place['post code'],
                city: data['place name'],
                state: data.state,
                stateCode: data['state abbreviation'],
                lat: parseFloat(place.latitude),
                lng: parseFloat(place.longitude),
              }));
              setSuggestions(citySuggestions.slice(0, 5)); // Limit to 5 suggestions
            }
          } catch (error) {
            console.log('City lookup failed');
          }
        }
      }
    } catch (error) {
      console.error('Address lookup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (value && value.length >= 2) {
        fetchZipSuggestions(value);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: ZipCodeData) => {
    const fullAddress = `${suggestion.city}, ${suggestion.stateCode} ${suggestion.zipCode}`;
    onChange(fullAddress, suggestion);
    onAddressSelected?.(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow click events
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className={cn("relative", className)}>
      {label && <Label htmlFor="address-input">{label}</Label>}
      <Input
        ref={inputRef}
        id="address-input"
        value={value}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full"
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.zipCode}-${index}`}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="font-medium">
                {suggestion.city}, {suggestion.stateCode} {suggestion.zipCode}
              </div>
              <div className="text-gray-500 text-xs">{suggestion.state}</div>
            </div>
          ))}
        </div>
      )}
      
      {isLoading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
        </div>
      )}
    </div>
  );
}