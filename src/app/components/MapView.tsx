import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Place, Friend, CEBU_CENTER } from '../data/mockData';
import { Users } from 'lucide-react';

interface MapViewProps {
  places: Place[];
  friends: Friend[];
  selectedPlace: Place | null;
  onPlaceSelect: (place: Place) => void;
  showFriends: boolean;
  userLocation: { lat: number; lng: number };
  routeDestination: Place | null;
}

export function MapView({ places, friends, selectedPlace, onPlaceSelect, showFriends, userLocation, routeDestination }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const circlesRef = useRef<L.Circle[]>([]);
  const polylineRef = useRef<L.Polyline | null>(null);

  const getHeatmapColor = (visitCount: number) => {
    if (visitCount > 1000) return '#ef4444';
    if (visitCount > 500) return '#f59e0b';
    if (visitCount > 200) return '#eab308';
    return '#22c55e';
  };

  const getHeatmapRadius = (visitCount: number) => {
    return Math.min(visitCount / 10, 150);
  };

  const createCustomIcon = (color: string, count: number) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">${count > 99 ? '99+' : count}</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  const friendIcon = L.divIcon({
    className: 'friend-marker',
    html: '<div style="background-color: #3b82f6; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">👤</div>',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

  const userLocationIcon = L.divIcon({
    className: 'user-location-marker',
    html: '<div style="background-color: #10b981; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([CEBU_CENTER.lat, CEBU_CENTER.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers and circles
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers and circles
    markersRef.current.forEach(marker => marker.remove());
    circlesRef.current.forEach(circle => circle.remove());
    markersRef.current = [];
    circlesRef.current = [];

    // Add user location marker
    const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userLocationIcon })
      .addTo(mapRef.current)
      .bindPopup('<div class="text-center"><p class="font-semibold">Your Location</p></div>');
    markersRef.current.push(userMarker);

    // Add heatmap circles for places
    places.forEach((place) => {
      const circle = L.circle([place.lat, place.lng], {
        radius: getHeatmapRadius(place.visitCount),
        fillColor: getHeatmapColor(place.visitCount),
        fillOpacity: 0.2,
        color: getHeatmapColor(place.visitCount),
        weight: 1,
        opacity: 0.4
      }).addTo(mapRef.current!);
      circlesRef.current.push(circle);
    });

    // Add place markers
    places.forEach((place) => {
      const marker = L.marker([place.lat, place.lng], {
        icon: createCustomIcon(getHeatmapColor(place.visitCount), place.visitCount)
      })
        .addTo(mapRef.current!)
        .bindPopup(`
          <div class="min-w-[200px]">
            <h3 class="font-semibold text-base mb-1">${place.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${place.category}</p>
            <div class="flex items-center gap-2 text-sm mb-1">
              <span class="text-yellow-500">★</span>
              <span>${place.rating}</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <span>👥 ${place.visitCount.toLocaleString()} visits</span>
            </div>
            <p class="text-sm mt-2">${place.priceRange}</p>
          </div>
        `)
        .on('click', () => onPlaceSelect(place));
      
      markersRef.current.push(marker);
    });

    // Add friend markers
    if (showFriends) {
      friends.forEach((friend) => {
        const marker = L.marker([friend.lat, friend.lng], { icon: friendIcon })
          .addTo(mapRef.current!)
          .bindPopup(`
            <div class="text-center">
              <img src="${friend.avatar}" alt="${friend.name}" class="w-12 h-12 rounded-full mx-auto mb-2" />
              <p class="font-semibold">${friend.name}</p>
              <p class="text-xs text-gray-500">${friend.status}</p>
              <p class="text-xs text-gray-400">${friend.lastSeen}</p>
            </div>
          `);
        
        markersRef.current.push(marker);
      });
    }
  }, [places, friends, showFriends, userLocation, onPlaceSelect]);

  // Update route polyline
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing polyline
    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    // Add new polyline if destination exists
    if (routeDestination) {
      const polyline = L.polyline([
        [userLocation.lat, userLocation.lng],
        [routeDestination.lat, routeDestination.lng]
      ], {
        color: '#3b82f6',
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10'
      }).addTo(mapRef.current);

      mapRef.current.fitBounds(polyline.getBounds(), { padding: [50, 50] });
      polylineRef.current = polyline;
    }
  }, [routeDestination, userLocation]);

  return (
    <div className="h-full w-full relative">
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* Heatmap legend */}
      <div className="absolute bottom-6 right-6 bg-white p-3 rounded-lg shadow-lg z-[1000]">
        <p className="text-xs font-semibold mb-2">Visit Heatmap</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Very Popular (1000+)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Popular (500-1000)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Moderate (200-500)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Growing (&lt;200)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
