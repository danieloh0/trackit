import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFriends, getLeaderboard, addFriend } from '../services/firebase';
import { Trophy, Medal, Award, Users, Plus, UserPlus } from 'lucide-react';

const Leaderboard = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendEmail, setFriendEmail] = useState('');
  const [addingFriend, setAddingFriend] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, [user]);

  const loadLeaderboard = async () => {
    try {
      const userFriends = await getFriends(user.uid);
      setFriends(userFriends);
      
      // Get friend IDs including current user
      const friendIds = [user.uid, ...userFriends.map(f => f.id)];
      const leaderboardData = await getLeaderboard(friendIds);
      
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (e) => {
    e.preventDefault();
    if (!friendEmail.trim()) return;

    setAddingFriend(true);
    try {
      await addFriend(user.uid, friendEmail.trim());
      setFriendEmail('');
      setShowAddFriend(false);
      await loadLeaderboard();
    } catch (error) {
      console.error('Error adding friend:', error);
      alert('Could not find user with that email address.');
    } finally {
      setAddingFriend(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-500" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">#{rank}</span>;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300';
      case 2:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300';
      case 3:
        return 'bg-gradient-to-r from-orange-100 to-orange-200 border-orange-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
        <p className="text-gray-600">See how you stack up against your friends!</p>
      </div>

      {/* Add Friend Section */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Your Network</h2>
          </div>
          <button
            onClick={() => setShowAddFriend(!showAddFriend)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Friend
          </button>
        </div>

        {showAddFriend && (
          <form onSubmit={handleAddFriend} className="mt-4">
            <div className="flex space-x-2">
              <input
                type="email"
                value={friendEmail}
                onChange={(e) => setFriendEmail(e.target.value)}
                placeholder="Enter friend's email address"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="submit"
                disabled={addingFriend}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {addingFriend ? 'Adding...' : 'Add'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Friends: <span className="font-medium">{friends.length}</span>
          </p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Rankings</h2>
        </div>

        <div className="p-6">
          {leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No friends yet</h3>
              <p className="text-gray-600 mb-4">Add friends to see the leaderboard!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((person, index) => {
                const rank = index + 1;
                const isCurrentUser = person.id === user.uid;
                
                return (
                  <div
                    key={person.id}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${getRankColor(rank)} ${
                      isCurrentUser ? 'ring-2 ring-blue-300' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getRankIcon(rank)}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <img
                            src={person.avatar || '/api/placeholder/40/40'}
                            alt={person.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {person.name}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  You
                                </span>
                              )}
                            </h3>
                            <p className="text-xs text-gray-600">
                              Level {person.level} • {person.completedTasks}/{person.totalTasks} tasks completed
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {person.totalPoints} pts
                        </div>
                        <div className="text-xs text-gray-600">
                          🔥 {person.streak} day streak
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Achievement Badges Preview */}
      <div className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Achievement Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              🏆
            </div>
            <p className="text-xs font-medium text-gray-700">First Place</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              🔥
            </div>
            <p className="text-xs font-medium text-gray-700">Streak Master</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              💯
            </div>
            <p className="text-xs font-medium text-gray-700">Perfect Day</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              ⭐
            </div>
            <p className="text-xs font-medium text-gray-700">Level Up</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;