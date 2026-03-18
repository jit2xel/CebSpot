import { useState } from 'react';
import { Place, Review, mockReviews } from '../data/mockData';
import { X, Star, MapPin, DollarSign, Users, Calendar, ThumbsUp, Navigation } from 'lucide-react';

interface PlaceDetailsProps {
  place: Place;
  onClose: () => void;
  onGetDirections: (place: Place) => void;
  onReserve: (place: Place) => void;
}

export function PlaceDetails({ place, onClose, onGetDirections, onReserve }: PlaceDetailsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');
  const placeReviews = mockReviews.filter(r => r.placeId === place.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[2000] flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{place.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === 'overview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === 'reviews'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Reviews ({placeReviews.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'overview' ? (
            <div className="space-y-4">
              {/* Rating and Stats */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="text-2xl font-semibold">{place.rating}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5" />
                  <span>{place.visitCount.toLocaleString()} visits</span>
                </div>
              </div>

              {/* Category Badge */}
              <div>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm capitalize">
                  {place.category}
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-gray-600">{place.description}</p>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-gray-600">{place.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium">Price Range</p>
                    <p className="text-sm text-gray-600">{place.priceRange}</p>
                  </div>
                </div>

                {place.requiresReservation && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Reservation</p>
                      <p className="text-sm text-gray-600">Required for entry</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Heatmap Info */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="font-semibold text-sm">High Activity Zone</span>
                </div>
                <p className="text-sm text-gray-600">
                  This location has been visited {place.visitCount.toLocaleString()} times by CebSpot users. 
                  Peak hours are usually in the evening.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {placeReviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No reviews yet. Be the first to review this place!</p>
                </div>
              ) : (
                placeReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {review.userName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold">{review.userName}</p>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
                          <ThumbsUp className="w-4 h-4" />
                          <span>Helpful ({review.helpful})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 flex gap-3">
          <button
            onClick={() => onGetDirections(place)}
            className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
          >
            <Navigation className="w-5 h-5" />
            Get Directions
          </button>
          {place.requiresReservation && (
            <button
              onClick={() => onReserve(place)}
              className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Reserve Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
