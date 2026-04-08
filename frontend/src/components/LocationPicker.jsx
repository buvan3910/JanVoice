import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { getPlaceSuggestions, reverseGeocode } from '../api/janvoiceApi';

// Fix default marker icons for bundlers (Vite)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).toString(),
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).toString(),
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).toString(),
});

function ClickToSetMarker({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lon: e.latlng.lng });
    },
  });
  return null;
}

const LocationPicker = ({ value, onChange, language, showMap = true }) => {
  const [query, setQuery] = useState(value || '');
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [placesError, setPlacesError] = useState('');
  const [pos, setPos] = useState({ lat: 12.9716, lon: 77.5946 }); // Bengaluru default
  const debounceRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  const center = useMemo(() => [pos.lat, pos.lon], [pos.lat, pos.lon]);

  const applyLocationText = (label, ward) => {
    const text = ward ? `${label} (Ward: ${ward})` : label;
    onChange(text);
    setQuery(text);
  };

  const pickLatLon = async ({ lat, lon }) => {
    setPos({ lat, lon });
    try {
      const r = await reverseGeocode(lat, lon);
      applyLocationText(r.label, r.ward);
    } catch {
      applyLocationText(`Lat ${lat.toFixed(5)}, Lon ${lon.toFixed(5)}`, null);
    }
  };

  const onInput = (v) => {
    setQuery(v);
    onChange(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!v || v.trim().length < 3) {
      setItems([]);
      setOpen(false);
      setPlacesError('');
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await getPlaceSuggestions(v.trim());
        setItems(res);
        setOpen(true);
        setPlacesError('');
      } catch {
        setItems([]);
        setOpen(false);
        setPlacesError(language === 'Kannada'
          ? 'ಸ್ಥಳ ಸಲಹೆಗಳು ಲಭ್ಯವಿಲ್ಲ (SerpAPI ಕೀ ಹೊಂದಿಸಲಾಗಿಲ್ಲ).'
          : 'Place suggestions unavailable (SERPAPI_API_KEY not set).');
      } finally {
        setLoading(false);
      }
    }, 350);
  };

  useEffect(() => {
    if (showMap && mapRef.current) {
      // Leaflet needs this when map is toggled from hidden -> visible
      setTimeout(() => mapRef.current?.invalidateSize?.(), 50);
    }
  }, [showMap]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => onInput(e.target.value)}
          placeholder={language === 'Kannada' ? 'ವಾರ್ಡ್ ಹೆಸರು ಅಥವಾ ಪ್ರದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ' : 'Type ward or area (min 3 letters)'}
          className="w-full pl-6 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gov-blue-600/10 focus:border-gov-blue-600 transition-all dark:text-white font-medium"
          onFocus={() => items.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />

        {open && items.length > 0 && (
          <div className="absolute z-50 mt-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden">
            <div className="max-h-72 overflow-auto">
              {items.map((it, idx) => (
                <button
                  key={`${it.place_id || it.label}-${idx}`}
                  type="button"
                  className="w-full text-left px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    applyLocationText(it.label, it.ward);
                    if (typeof it.lat === 'number' && typeof it.lon === 'number') {
                      setPos({ lat: it.lat, lon: it.lon });
                    }
                    setOpen(false);
                  }}
                >
                  <div className="text-sm font-bold text-slate-900 dark:text-white">{it.label}</div>
                  {it.address && (
                    <div className="text-xs text-slate-500 font-medium mt-1">{it.address}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
            {language === 'Kannada' ? 'ಹುಡುಕುತ್ತಿದೆ...' : 'Searching...'}
          </div>
        )}
      </div>

      {placesError && (
        <div className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-3">
          {placesError}
        </div>
      )}

      {showMap && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <MapContainer
            center={center}
            zoom={13}
            style={{ height: 240, width: '100%' }}
            whenCreated={(map) => {
              mapRef.current = map;
            }}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ClickToSetMarker onPick={pickLatLon} />
            <Marker
              position={center}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const m = e.target;
                  const ll = m.getLatLng();
                  pickLatLon({ lat: ll.lat, lon: ll.lng });
                },
              }}
            />
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;

