import { useRef } from 'react';
import { Place } from '../data/mockData';
import { Star, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MapCardCarouselProps {
  places: Place[];
  onPlaceClick: (place: Place) => void;
}

// Map place IDs to images
const placeImages: Record<string, string> = {
  '1': 'https://images.unsplash.com/photo-1593870682262-8c9f6a9bb225?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxpcGlubyUyMHN0cmVldCUyMGZvb2QlMjBiYnF8ZW58MXx8fHwxNzczMTczOTg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  '2': 'https://images.unsplash.com/photo-1573840357491-06851c72e0d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb2ZmZWUlMjBzaG9wJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzczMDY4ODM5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  '3': 'https://images.unsplash.com/photo-1761095596849-608b6a337c36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5lJTIwZGluaW5nJTIwcmVzdGF1cmFudCUyMGVsZWdhbnR8ZW58MXx8fHwxNzczMTczOTkwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  '4': 'https://images.unsplash.com/photo-1625612446042-afd3fe024131?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuaWdodGNsdWIlMjBwYXJ0eSUyMGxpZ2h0c3xlbnwxfHx8fDE3NzMxNzM5OTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
  '5': 'https://images.unsplash.com/photo-1759299710388-690bf2305e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHN0cmVldCUyMGZvb2QlMjBtYXJrZXR8ZW58MXx8fHwxNzczMTIxMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  '6': 'https://images.unsplash.com/photo-1680381665152-b7e5151c4153?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGVjaWFsdHklMjBjb2ZmZWUlMjByb2FzdGVyfGVufDF8fHx8MTc3MzE3Mzk5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
  '7': 'https://images.unsplash.com/photo-1718953323206-f45ed03ffca5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3VudGFpbiUyMHBhbm9yYW1pYyUyMHZpZXclMjBzdW5zZXR8ZW58MXx8fHwxNzczMTczOTkyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  '8': 'https://images.unsplash.com/photo-1653762239682-56046dc5cbad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY2FuJTIwYmFyJTIwcmVzdGF1cmFudCUyMGNvbG9yZnVsfGVufDF8fHx8MTc3MzE3Mzk5Mnww&ixlib=rb-4.1.0&q=80&w=1080',
  '9': 'https://images.unsplash.com/photo-1560335213-9300d1fd6d4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaXN0b3JpYyUyMHRlbXBsZSUyMGFyY2hpdGVjdHVyZXxlbnwxfHx8fDE3NzMxNzM5OTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  '10': 'https://images.unsplash.com/photo-1736520537688-1f1f06b71605?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc2FuJTIwYmFrZXJ5JTIwcGFzdHJpZXN8ZW58MXx8fHwxNzczMDgxODEyfDA&ixlib=rb-4.1.0&q=80&w=1080'
};

export function MapCardCarousel({ places, onPlaceClick }: MapCardCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 280; // Card width + gap
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Sort places by visit count (popularity) and take top places
  const popularPlaces = [...places]
    .sort((a, b) => b.visitCount - a.visitCount)
    .slice(0, 10);

  return (
    <div className="relative w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-gray-900">Trending Spots</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll('left')}
            className="p-1 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-3 h-3 text-gray-600" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-1 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors border border-gray-200"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-3 h-3 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-4 pb-1"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {popularPlaces.map((place) => (
          <div
            key={place.id}
            onClick={() => onPlaceClick(place)}
            className="flex-shrink-0 w-40 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-lg"
          >
            {/* Image */}
            <div className="relative h-20 overflow-hidden">
              <ImageWithFallback
                src={placeImages[place.id]}
                alt={place.name}
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              
              {/* Visit Count Badge */}
              <div className="absolute top-1 right-1 bg-blue-600 text-white px-1.5 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" />
                {place.visitCount}
              </div>

              {/* Price Range */}
              <div className="absolute top-1 left-1 bg-white/90 backdrop-blur-sm text-gray-800 px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
                {place.priceRange}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-2">
              <h4 className="text-xs font-semibold text-gray-900 truncate mb-0.5">
                {place.name}
              </h4>
              
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-[11px] font-medium text-gray-900">{place.rating}</span>
                </div>
                <span className="text-[10px] text-gray-500 capitalize truncate max-w-[60px]">{place.category}</span>
              </div>

              <p className="text-[10px] text-gray-600 line-clamp-1">
                {place.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CSS to hide scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}