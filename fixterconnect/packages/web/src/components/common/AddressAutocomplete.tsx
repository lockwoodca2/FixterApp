import React, { useEffect, useRef } from 'react';

// Declare google as a global
declare global {
  interface Window {
    google: any;
  }
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (placeDetails: {
    address: string;
    city?: string;
    state?: string;
    zipCode?: string;
    lat?: number;
    lng?: number;
  }) => void;
  placeholder?: string;
  style?: React.CSSProperties;
  autoFocus?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = 'Enter address...',
  style,
  autoFocus = false,
  onKeyDown
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    // Wait for Google Maps to load
    const initAutocomplete = () => {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        // Retry after a short delay if Google Maps isn't loaded yet
        setTimeout(initAutocomplete, 100);
        return;
      }

      if (!inputRef.current || autocompleteRef.current) return;

      // Initialize the autocomplete
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'us' }, // Restrict to US addresses
        fields: ['address_components', 'formatted_address', 'geometry']
      });

      // Listen for place selection
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();

        if (!place.formatted_address) return;

        // Extract address components
        let city = '';
        let state = '';
        let zipCode = '';

        if (place.address_components) {
          for (const component of place.address_components) {
            const types = component.types;
            if (types.includes('locality')) {
              city = component.long_name;
            }
            if (types.includes('administrative_area_level_1')) {
              state = component.short_name;
            }
            if (types.includes('postal_code')) {
              zipCode = component.long_name;
            }
          }
        }

        // Update the input value
        onChange(place.formatted_address);

        // Call onSelect with parsed details
        if (onSelect) {
          onSelect({
            address: place.formatted_address,
            city,
            state,
            zipCode,
            lat: place.geometry?.location?.lat(),
            lng: place.geometry?.location?.lng()
          });
        }
      });
    };

    initAutocomplete();

    // Cleanup
    return () => {
      if (autocompleteRef.current && window.google?.maps?.event) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onChange, onSelect]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent form submission when selecting from dropdown with Enter
    if (e.key === 'Enter') {
      // Check if the autocomplete dropdown is open
      const pacContainer = document.querySelector('.pac-container');
      if (pacContainer && pacContainer.querySelectorAll('.pac-item').length > 0) {
        e.preventDefault();
        return;
      }
    }

    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      autoFocus={autoFocus}
      style={{
        width: '100%',
        padding: '12px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        fontSize: '14px',
        outline: 'none',
        ...style
      }}
    />
  );
};

export default AddressAutocomplete;
