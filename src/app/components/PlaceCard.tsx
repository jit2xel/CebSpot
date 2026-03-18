import { Place } from '../data/mockData';
import { MapPin, Star, Users } from 'lucide-react';

interface PlaceCardProps {
  place: Place;
  onClick: () => void;
}

export function PlaceCard({ place, onClick }: PlaceCardProps) {
  const getHeatmapColor = (visitCount: number) => {
    if (visitCount > 1000) return 'bg-red-500';
    if (visitCount > 500) return 'bg-orange-500';
    if (visitCount > 200) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div
      onClick={onClick}
      className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer bg-white"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-base">{place.name}</h3>
        <div className={`w-2 h-2 rounded-full ${getHeatmapColor(place.visitCount)}`}></div>
      </div>

      <p className="text-sm text-gray-600 capitalize mb-2">{place.category}</p>

      <div className="flex items-center gap-4 text-sm mb-2">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span>{place.rating}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-600">
          <Users className="w-4 h-4" />
          <span>{place.visitCount.toLocaleString()}</span>
        </div>
        <span className="text-gray-600">{place.priceRange}</span>
      </div>

      <div className="flex items-start gap-1 text-sm text-gray-500">
        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span className="line-clamp-1">{place.address}</span>
      </div>

      {place.requiresReservation && (
        <div className="mt-2">
          <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
            Reservation Required
          </span>
        </div>
      )}
    </div>
  );
}
