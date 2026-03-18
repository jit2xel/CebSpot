import { Friend } from '../data/mockData';
import { X, MapPin, Clock } from 'lucide-react';

interface FriendLocatorProps {
  friends: Friend[];
  onClose: () => void;
  onLocateFriend: (friend: Friend) => void;
}

export function FriendLocator({ friends, onClose, onLocateFriend }: FriendLocatorProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[2000] flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-md sm:rounded-lg max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Friend Locator</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Friend List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {friends.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No friends in your circle yet.</p>
              <p className="text-sm mt-2">Add friends to see their location!</p>
            </div>
          ) : (
            friends.map((friend) => (
              <div
                key={friend.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                onClick={() => onLocateFriend(friend)}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{friend.name}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{friend.status}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{friend.lastSeen}</span>
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Friend Button */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Add Friend to Circle
          </button>
        </div>
      </div>
    </div>
  );
}
