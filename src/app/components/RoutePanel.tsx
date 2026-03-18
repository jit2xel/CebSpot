import { useState } from 'react';
import { Place, RideHailingApp, mockRideHailingApps } from '../data/mockData';
import { X, Navigation, Clock, MapPin, Car, Bike, Bus, ExternalLink } from 'lucide-react';

interface RoutePanelProps {
  destination: Place;
  userLocation: { lat: number; lng: number };
  onClose: () => void;
}

export function RoutePanel({ destination, userLocation, onClose }: RoutePanelProps) {
  const [transportMode, setTransportMode] = useState<'car' | 'bike' | 'transit'>('car');

  // Calculate mock distance and time
  const calculateDistance = () => {
    const lat1 = userLocation.lat;
    const lon1 = userLocation.lng;
    const lat2 = destination.lat;
    const lon2 = destination.lng;

    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance.toFixed(1);
  };

  const distance = parseFloat(calculateDistance());
  const estimatedTime = transportMode === 'car' ? Math.ceil(distance * 3) : 
                        transportMode === 'bike' ? Math.ceil(distance * 5) : 
                        Math.ceil(distance * 7);

  // Calculate fares based on distance
  const rideAppsWithFares: RideHailingApp[] = mockRideHailingApps.map(app => ({
    ...app,
    estimatedFare: Math.round(distance * (app.id === 'angkas' ? 15 : app.id === 'grab' ? 25 : app.id === 'uber' ? 28 : 20)),
    estimatedTime: `${estimatedTime} min`
  }));

  const handleOpenRideApp = (app: RideHailingApp) => {
    // In a real app, this would deep link to the ride-hailing app
    window.open(app.deepLink, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[2000] flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Route to {destination.name}</h2>
            <p className="text-sm text-gray-600">{destination.address}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Route Summary */}
          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="font-medium">{distance} km away</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="font-medium">~{estimatedTime} min</span>
              </div>
            </div>

            {/* Transport Mode Selector */}
            <div className="flex gap-2">
              <button
                onClick={() => setTransportMode('car')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 ${
                  transportMode === 'car' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Car className="w-4 h-4" />
                <span className="text-sm">Drive</span>
              </button>
              <button
                onClick={() => setTransportMode('bike')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 ${
                  transportMode === 'bike' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Bike className="w-4 h-4" />
                <span className="text-sm">Bike</span>
              </button>
              <button
                onClick={() => setTransportMode('transit')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 ${
                  transportMode === 'transit' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Bus className="w-4 h-4" />
                <span className="text-sm">Transit</span>
              </button>
            </div>
          </div>

          {/* Directions Steps */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold mb-3">Directions</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-0.5 h-full bg-gray-300 my-1"></div>
                </div>
                <div className="flex-1 pb-3">
                  <p className="font-medium">Your Location</p>
                  <p className="text-sm text-gray-600">Starting point</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <Navigation className="w-3 h-3 text-blue-600" />
                  <div className="w-0.5 h-full bg-gray-300 my-1"></div>
                </div>
                <div className="flex-1 pb-3">
                  <p className="font-medium">Head {destination.lat > userLocation.lat ? 'North' : 'South'}</p>
                  <p className="text-sm text-gray-600">{(distance * 0.3).toFixed(1)} km</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <Navigation className="w-3 h-3 text-blue-600" />
                  <div className="w-0.5 h-full bg-gray-300 my-1"></div>
                </div>
                <div className="flex-1 pb-3">
                  <p className="font-medium">Turn {destination.lng > userLocation.lng ? 'Right' : 'Left'}</p>
                  <p className="text-sm text-gray-600">Continue for {(distance * 0.5).toFixed(1)} km</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{destination.name}</p>
                  <p className="text-sm text-gray-600">{destination.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ride-Hailing Apps */}
          <div className="p-4">
            <h3 className="font-semibold mb-3">Available Ride-Hailing Services</h3>
            <p className="text-sm text-gray-600 mb-3">
              Book a ride directly from these apps:
            </p>
            <div className="space-y-3">
              {rideAppsWithFares.map((app) => (
                <button
                  key={app.id}
                  onClick={() => handleOpenRideApp(app)}
                  className="w-full border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{app.icon}</div>
                    <div className="text-left">
                      <p className="font-semibold">{app.name}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {app.estimatedTime}
                        </span>
                        <span className="font-semibold text-green-600">
                          ₱{app.estimatedFare}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Open in Maps Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destination.lat},${destination.lng}`, '_blank')}
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
          >
            <Navigation className="w-5 h-5" />
            Open in Google Maps
          </button>
        </div>
      </div>
    </div>
  );
}
