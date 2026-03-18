import { useState, useMemo } from 'react';
import { MapView } from './components/MapView';
import { SearchBar } from './components/SearchBar';
import { PlaceCard } from './components/PlaceCard';
import { PlaceDetails } from './components/PlaceDetails';
import { FriendLocator } from './components/FriendLocator';
import { ReservationModal } from './components/ReservationModal';
import { RoutePanel } from './components/RoutePanel';
import { Logo, LogoText } from './components/Logo';
import { MapCardCarousel } from './components/MapCardCarousel';
import { mockPlaces, mockFriends, Place, Friend, CEBU_CENTER } from './data/mockData';
import { Map, List, Users, Menu, X, Search, Calendar, User } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'explore' | 'search' | 'friends' | 'reservations' | 'profile'>('explore');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showFriendLocator, setShowFriendLocator] = useState(false);
  const [showFriends, setShowFriends] = useState(true);
  const [reservationPlace, setReservationPlace] = useState<Place | null>(null);
  const [routeDestination, setRouteDestination] = useState<Place | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Mock user location (Cebu City center)
  const userLocation = { lat: CEBU_CENTER.lat, lng: CEBU_CENTER.lng };

  // Filter places based on search and category
  const filteredPlaces = useMemo(() => {
    return mockPlaces.filter((place) => {
      const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          place.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          place.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || place.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleGetDirections = (place: Place) => {
    setSelectedPlace(null);
    setRouteDestination(place);
  };

  const handleReserve = (place: Place) => {
    setSelectedPlace(null);
    setReservationPlace(place);
  };

  const handleLocateFriend = (friend: Friend) => {
    setShowFriendLocator(false);
    // Center map on friend location - in real app, this would update map center
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Logo size={48} />
              <div>
                <h1 className="text-xl font-bold">CebSpot</h1>
                <p className="text-xs text-blue-100">Discover. Explore. Connect.</p>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => setShowFriends(!showFriends)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  showFriends ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="text-sm">Friends</span>
              </button>
              <button
                onClick={() => setShowFriendLocator(true)}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                <span className="text-sm">Friend Locator</span>
              </button>
              <div className="flex bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1.5 rounded flex items-center gap-2 text-sm ${
                    viewMode === 'map' ? 'bg-white text-blue-600' : 'text-white'
                  }`}
                >
                  <Map className="w-4 h-4" />
                  Map
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded flex items-center gap-2 text-sm ${
                    viewMode === 'list' ? 'bg-white text-blue-600' : 'text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Trending Spots Carousel - shown only in Explore tab */}
          {activeTab === 'explore' && (
            <div className="mb-3 -mx-4 px-4 py-2 bg-white/10 backdrop-blur-sm">
              <MapCardCarousel
                places={mockPlaces}
                onPlaceClick={setSelectedPlace}
              />
            </div>
          )}

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden space-y-2 pb-2">
              <button
                onClick={() => {
                  setShowFriends(!showFriends);
                  setShowMobileMenu(false);
                }}
                className={`w-full px-4 py-2 rounded-lg flex items-center gap-2 ${
                  showFriends ? 'bg-white/20' : 'bg-white/10'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="text-sm">Toggle Friends on Map</span>
              </button>
              <button
                onClick={() => {
                  setShowFriendLocator(true);
                  setShowMobileMenu(false);
                }}
                className="w-full px-4 py-2 rounded-lg bg-white/10 flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                <span className="text-sm">Friend Locator</span>
              </button>
              <div className="flex bg-white/10 rounded-lg p-1">
                <button
                  onClick={() => {
                    setViewMode('map');
                    setShowMobileMenu(false);
                  }}
                  className={`flex-1 py-2 rounded flex items-center justify-center gap-2 text-sm ${
                    viewMode === 'map' ? 'bg-white text-blue-600' : 'text-white'
                  }`}
                >
                  <Map className="w-4 h-4" />
                  Map
                </button>
                <button
                  onClick={() => {
                    setViewMode('list');
                    setShowMobileMenu(false);
                  }}
                  className={`flex-1 py-2 rounded flex items-center justify-center gap-2 text-sm ${
                    viewMode === 'list' ? 'bg-white text-blue-600' : 'text-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                  List
                </button>
              </div>
            </div>
          )}

          {/* Search Bar */}
          <SearchBar
            onSearch={setSearchQuery}
            onCategoryFilter={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex pb-16">
        {activeTab === 'explore' && (
          <>
            {viewMode === 'map' ? (
              <div className="flex-1 relative">
                <MapView
                  places={filteredPlaces}
                  friends={mockFriends}
                  selectedPlace={selectedPlace}
                  onPlaceSelect={setSelectedPlace}
                  showFriends={showFriends}
                  userLocation={userLocation}
                  routeDestination={routeDestination}
                />

                {/* Results Count */}
                <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg z-[1000]">
                  <p className="text-sm font-medium">
                    {filteredPlaces.length} {filteredPlaces.length === 1 ? 'spot' : 'spots'} found
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto">
                  <div className="mb-4">
                    <p className="text-gray-600">
                      {filteredPlaces.length} {filteredPlaces.length === 1 ? 'spot' : 'spots'} found
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPlaces.map((place) => (
                      <PlaceCard
                        key={place.id}
                        place={place}
                        onClick={() => setSelectedPlace(place)}
                      />
                    ))}
                  </div>
                  {filteredPlaces.length === 0 && (
                    <div className="text-center py-12">
                      <Map className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No spots found</p>
                      <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'search' && (
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Search Spots</h2>
              <div className="mb-6">
                <SearchBar
                  onSearch={setSearchQuery}
                  onCategoryFilter={setSelectedCategory}
                  selectedCategory={selectedCategory}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPlaces.map((place) => (
                  <PlaceCard
                    key={place.id}
                    place={place}
                    onClick={() => setSelectedPlace(place)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'friends' && (
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">My Friends</h2>
              <div className="space-y-3 mb-6">
                {mockFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={friend.avatar}
                        alt={friend.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{friend.name}</p>
                        <p className="text-sm text-gray-600">{friend.status}</p>
                        <p className="text-xs text-gray-400">{friend.lastSeen}</p>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setShowFriendLocator(true)}
                className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                View on Map
              </button>
            </div>
          </div>
        )}

        {activeTab === 'reservations' && (
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">My Reservations</h2>
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No reservations yet</p>
                <p className="text-sm text-gray-400">Book a table at high-end restaurants from the Explore tab</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Profile</h2>
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    U
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Guest User</h3>
                    <p className="text-gray-600">guest@cebspot.com</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Places Visited</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Reviews Written</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Friends</span>
                    <span className="font-semibold">{mockFriends.length}</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-600">Reservations</span>
                    <span className="font-semibold">0</span>
                  </div>
                </div>
              </div>
              <button className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mb-2">
                Edit Profile
              </button>
              <button className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                Settings
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around h-16">
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === 'explore' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Map className={`w-6 h-6 mb-1 ${activeTab === 'explore' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-xs font-medium">Explore</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === 'search' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Search className={`w-6 h-6 mb-1 ${activeTab === 'search' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-xs font-medium">Search</span>
          </button>

          <button
            onClick={() => setActiveTab('friends')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === 'friends' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Users className={`w-6 h-6 mb-1 ${activeTab === 'friends' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-xs font-medium">Friends</span>
          </button>

          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === 'reservations' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Calendar className={`w-6 h-6 mb-1 ${activeTab === 'reservations' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-xs font-medium">Bookings</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === 'profile' ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <User className={`w-6 h-6 mb-1 ${activeTab === 'profile' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      {selectedPlace && (
        <PlaceDetails
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
          onGetDirections={handleGetDirections}
          onReserve={handleReserve}
        />
      )}

      {showFriendLocator && (
        <FriendLocator
          friends={mockFriends}
          onClose={() => setShowFriendLocator(false)}
          onLocateFriend={handleLocateFriend}
        />
      )}

      {reservationPlace && (
        <ReservationModal
          place={reservationPlace}
          onClose={() => setReservationPlace(null)}
        />
      )}

      {routeDestination && (
        <RoutePanel
          destination={routeDestination}
          userLocation={userLocation}
          onClose={() => setRouteDestination(null)}
        />
      )}
    </div>
  );
}

export default App;