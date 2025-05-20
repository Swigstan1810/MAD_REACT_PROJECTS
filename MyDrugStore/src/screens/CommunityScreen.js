// Enhanced CommunityScreen.js with immediate score updating

import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  SafeAreaView, 
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { communityService } from '../services/api';
import { useFocusEffect } from '@react-navigation/native';

const CommunityScreen = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastScore, setLastScore] = useState(0);
  
  const { user } = useSelector(state => state.auth);
  const { currentLearning, finished } = useSelector(state => state.learning);
  const { records } = useSelector(state => state.studyRecords);
  const dispatch = useDispatch();
  
  // Calculate the highest score from user's study records
  const calculateUserHighestScore = useCallback(() => {
    if (!records || records.length === 0) return 0;
    
    const highestScore = records.reduce((highest, record) => {
      return Math.max(highest, record.highestScore || 0);
    }, 0);
    
    console.log('Calculated highest score:', highestScore);
    return highestScore;
  }, [records]);
  
  // Update the last score whenever records change
  useEffect(() => {
    const newHighestScore = calculateUserHighestScore();
    if (newHighestScore !== lastScore) {
      console.log('Score changed from', lastScore, 'to', newHighestScore);
      setLastScore(newHighestScore);
      // If we already have rankings loaded, update them immediately
      if (rankings.length > 0 && user) {
        updateUserScoreInRankings(newHighestScore);
      }
    }
  }, [records, calculateUserHighestScore]);
  
  // Sample data for demonstration - will be used if API fails or no data returned
  const sampleRankings = [
    { id: 'user1', username: 'John Doe', gender: 'male', totalScore: 850, currentLearningCount: 5, finishedCount: 12 },
    { id: 'user2', username: 'Jane Smith', gender: 'female', totalScore: 720, currentLearningCount: 4, finishedCount: 8 },
    { id: 'user3', username: 'Alex Johnson', gender: 'male', totalScore: 680, currentLearningCount: 3, finishedCount: 10 },
    { id: 'user4', username: 'Sara Williams', gender: 'female', totalScore: 590, currentLearningCount: 6, finishedCount: 5 },
    { id: 'user5', username: 'Michael Brown', gender: 'male', totalScore: 520, currentLearningCount: 2, finishedCount: 7 },
  ];
  
  // Function to update the user's score in the rankings immediately
  const updateUserScoreInRankings = (newScore) => {
    if (!user || !rankings.length) return;
    
    console.log('Updating user score in rankings to:', newScore);
    
    // Create new rankings array with updated user score
    const updatedRankings = rankings.map(rank => 
      rank.id === user.id ? {
        ...rank,
        totalScore: newScore
      } : rank
    );
    
    // If user not found in rankings, add them
    if (!updatedRankings.some(rank => rank.id === user.id)) {
      updatedRankings.push({
        id: user.id,
        username: user.username || 'You',
        gender: user.gender || 'male',
        totalScore: newScore,
        currentLearningCount: currentLearning.length,
        finishedCount: finished.length
      });
    }
    
    // Sort the rankings
    updatedRankings.sort((a, b) => b.totalScore - a.totalScore);
    setRankings(updatedRankings);
  };

  // If the user is logged in, add them to the sample rankings
  const getSampleRankingsWithUser = useCallback(() => {
    if (!user) return sampleRankings;
    
    console.log('Adding current user to rankings with username:', user.username);
    
    // Get real counts and scores for current user
    const userCurrentLearningCount = currentLearning.length;
    const userFinishedCount = finished.length;
    const userHighestScore = calculateUserHighestScore();
    
    // Check if user is already in the rankings
    const userExists = sampleRankings.some(rank => rank.id === user.id);
    if (userExists) {
      return sampleRankings.map(rank => 
        rank.id === user.id ? { 
          ...rank, 
          username: user.username, 
          gender: user.gender,
          totalScore: userHighestScore || rank.totalScore, // Use real score if available
          currentLearningCount: userCurrentLearningCount,
          finishedCount: userFinishedCount
        } : rank
      );
    }
    
    // Add the user to rankings if not already there
    return [
      ...sampleRankings,
      { 
        id: user.id || 'currentUser', 
        username: user.username || 'You', 
        gender: user.gender || 'male', 
        totalScore: userHighestScore || 650, // Use real score if available, fallback to 650
        currentLearningCount: userCurrentLearningCount,
        finishedCount: userFinishedCount
      }
    ].sort((a, b) => b.totalScore - a.totalScore);
  }, [user, currentLearning.length, finished.length, calculateUserHighestScore]);
  
  const fetchRankings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching rankings, current user:', user?.username);
      
      // Simulate the two-second response delay mentioned in the requirements
      const fetchStartTime = Date.now();
      let response;
      
      try {
        // Try to get real data
        response = await communityService.getRankings();
      } catch (apiError) {
        console.error('Error fetching rankings from API:', apiError);
        throw apiError;
      }
      
      // Ensure we display the loader for at least 2 seconds
      const elapsedTime = Date.now() - fetchStartTime;
      if (elapsedTime < 2000) {
        await new Promise(resolve => setTimeout(resolve, 2000 - elapsedTime));
      }
      
      // Handle empty rankings case
      if (!response || response.length === 0) {
        // Use sample data if no real data available
        const mockRankings = getSampleRankingsWithUser();
        setRankings(mockRankings);
        console.log('No rankings from API, using sample data with user:', user?.username);
      } else {
        // If we have the current user in the state, update their counts and ensure username is correct
        if (user) {
          const userCurrentLearningCount = currentLearning.length;
          const userFinishedCount = finished.length;
          const userHighestScore = calculateUserHighestScore();
          
          // Find the current user in the rankings
          const userIndex = response.findIndex(rank => rank.id === user.id);
          
          if (userIndex >= 0) {
            // Update the current user's data
            response[userIndex] = {
              ...response[userIndex],
              username: user.username, // Always use the latest username
              totalScore: userHighestScore || response[userIndex].totalScore, // Use the real score
              currentLearningCount: userCurrentLearningCount,
              finishedCount: userFinishedCount
            };
          } else {
            // Add the current user if not in the rankings
            response.push({
              id: user.id,
              username: user.username,
              gender: user.gender,
              totalScore: userHighestScore || 0,
              currentLearningCount: userCurrentLearningCount,
              finishedCount: userFinishedCount
            });
          }
          
          // Sort the rankings after adding/updating the user
          response.sort((a, b) => b.totalScore - a.totalScore);
        }
        
        setRankings(response);
        console.log('Received rankings from API:', response.length);
      }
    } catch (error) {
      console.error('Error in fetchRankings:', error);
      setError('Could not load rankings. Using sample data.');
      
      // Use sample data as fallback
      setRankings(getSampleRankingsWithUser());
    } finally {
      setLoading(false);
    }
  }, [user, currentLearning, finished, getSampleRankingsWithUser, calculateUserHighestScore]);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRankings();
    setRefreshing(false);
  };
  
  // Fetch rankings whenever the screen comes into focus or key data changes
  useFocusEffect(
    React.useCallback(() => {
      fetchRankings();
      return () => {}; // Cleanup function
    }, [fetchRankings])
  );
  
  const renderRankingItem = ({ item, index }) => {
    const isCurrentUser = user && item.id === user.id;
    
    // Determine badge color based on score
    const getBadgeColor = (score) => {
      if (score >= 900) return '#FFD700'; // Gold for top scores
      if (score >= 750) return '#48D1CC'; // Turquoise for high scores
      if (score >= 500) return '#4A80F0'; // Default blue
      return '#777777'; // Gray for lower scores
    };
    
    return (
      <View style={[
        styles.rankingItem,
        isCurrentUser && styles.currentUserItem
      ]}>
        <View style={styles.rankColumn}>
          <View style={[
            styles.rankBadge,
            { backgroundColor: getBadgeColor(item.totalScore) }
          ]}>
            <Text style={styles.rankText}>{index + 1}</Text>
          </View>
        </View>
        
        <View style={styles.userInfoColumn}>
          <Text style={[
            styles.userName,
            isCurrentUser && styles.currentUserText
          ]}>
            {item.username} {isCurrentUser && "(You)"}
          </Text>
          <Text style={styles.userGender}>
            {item.gender}
          </Text>
        </View>
        
        <View style={styles.progressColumn}>
          <View style={[
            styles.scoreContainer,
            { backgroundColor: getBadgeColor(item.totalScore) }
          ]}>
            <Text style={styles.scoreText}>{item.totalScore}</Text>
          </View>
          <Text style={styles.progressText}>
            {item.currentLearningCount} learning / {item.finishedCount} finished
          </Text>
        </View>
      </View>
    );
  };
  
  return (
    <ImageBackground 
      source={require('../assets/back1.jpg')}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.15)', 'rgba(0,0,0,0.20)']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Student Community</Text>
            <Text style={styles.subtitle}>Pronunciation Rankings</Text>
          </View>
          
          {loading && !refreshing ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Loading rankings...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={60} color="#fff" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={fetchRankings}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={rankings}
              keyExtractor={(item, index) => item.id?.toString() || index.toString()}
              renderItem={renderRankingItem}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#fff"
                  colors={['#fff']}
                />
              }
              ListHeaderComponent={
                <View style={styles.legendContainer}>
                  <Text style={styles.legendText}>Pull down to refresh rankings</Text>
                  {lastScore > 0 && (
                    <View style={styles.scoreUpdate}>
                      <Text style={styles.scoreUpdateText}>
                        Your current best score: {lastScore}
                      </Text>
                    </View>
                  )}
                </View>
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No rankings available yet</Text>
                </View>
              }
              ListFooterComponent={
                <View style={styles.footerContainer}>
                  <Text style={styles.footerText}>
                    * The score represents your highest pronunciation score
                  </Text>
                </View>
              }
            />
          )}
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginTop: 5,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  legendContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  legendText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8,
  },
  scoreUpdate: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  scoreUpdateText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  rankingItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 10,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  currentUserItem: {
    backgroundColor: 'rgba(74, 128, 240, 0.9)',
    borderLeftWidth: 5,
    borderLeftColor: '#50C878',
  },
  currentUserText: {
    color: '#fff',
  },
  rankColumn: {
    marginRight: 15,
    justifyContent: 'center',
  },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4A80F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userInfoColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userGender: {
    fontSize: 14,
    color: '#666',
  },
  progressColumn: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  scoreContainer: {
    backgroundColor: '#4A80F0',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 5,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  footerContainer: {
    padding: 15,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    fontStyle: 'italic',
  }
});

export default CommunityScreen;