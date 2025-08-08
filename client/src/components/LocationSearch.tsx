import { useState } from "react";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { MapPin, Search } from "lucide-react";

interface ZipCodeData {
  zipCode: string;
  city: string;
  state: string;
  stateCode: string;
  lat: number;
  lng: number;
}

interface LocationSearchProps {
  onLocationSearch: (searchData: {
    zipCode?: string;
    lat?: number;
    lng?: number;
    radius?: number;
    locationText?: string;
  }) => void;
  className?: string;
}

export function LocationSearch({ onLocationSearch, className }: LocationSearchProps) {
  const [locationInput, setLocationInput] = useState("");
  const [radius, setRadius] = useState([100]); // Default 100 miles
  const [selectedLocation, setSelectedLocation] = useState<ZipCodeData | null>(null);

  const handleAddressSelected = (addressData: ZipCodeData) => {
    setSelectedLocation(addressData);
    const locationText = `${addressData.city}, ${addressData.stateCode} ${addressData.zipCode}`;
    
    onLocationSearch({
      zipCode: addressData.zipCode,
      lat: addressData.lat,
      lng: addressData.lng,
      radius: radius[0],
      locationText: locationText
    });
  };

  const handleRadiusChange = (newRadius: number[]) => {
    setRadius(newRadius);
    
    // If we have a selected location, trigger search with new radius
    if (selectedLocation) {
      const locationText = `${selectedLocation.city}, ${selectedLocation.stateCode} ${selectedLocation.zipCode}`;
      onLocationSearch({
        zipCode: selectedLocation.zipCode,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
        radius: newRadius[0],
        locationText: locationText
      });
    }
  };

  const handleClearLocation = () => {
    setLocationInput("");
    setSelectedLocation(null);
    onLocationSearch({});
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Location
        </Label>
        <AddressAutocomplete
          value={locationInput}
          onChange={(value, addressData) => {
            setLocationInput(value);
            if (addressData) {
              handleAddressSelected(addressData);
            }
          }}
          onAddressSelected={handleAddressSelected}
          placeholder="Enter ZIP code or city, state..."
          className="w-full"
        />
        {selectedLocation && (
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{selectedLocation.city}, {selectedLocation.stateCode} {selectedLocation.zipCode}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearLocation}
              className="h-auto p-1 text-xs"
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Search Radius: {radius[0]} miles
        </Label>
        <Slider
          value={radius}
          onValueChange={handleRadiusChange}
          max={200}
          min={10}
          step={10}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>10 miles</span>
          <span>200 miles</span>
        </div>
      </div>

      {selectedLocation && (
        <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
          Searching within {radius[0]} miles of {selectedLocation.city}, {selectedLocation.stateCode}
        </div>
      )}
    </div>
  );
}