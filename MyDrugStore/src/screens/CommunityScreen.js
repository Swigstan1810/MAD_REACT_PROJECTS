import React, { useState, useEffect } from 'react';
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

const CommunityScreen = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  const { user } = useSelector(state => state.auth);
  
  const fetchRankings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await communityService.getRankings();
      setRankings(response);
    } catch (error) {
      console.error('Error fetching rankings:', error);
      setError('Could not load rankings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRankings();
    setRefreshing(false);
  };
  
  useEffect(() => {
    fetchRankings();
  }, []);
  
  const renderRankingItem = ({ item, index }) => {
    const isCurrentUser = user && item.id === user.id;
    
    return (
      <View style={[
        styles.rankingItem,
        isCurrentUser && styles.currentUserItem
      ]}>
        <View style={styles.rankColumn}>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>{index + 1}</Text>
          </View>
        </View>
        
        <View style={styles.userInfoColumn}>
          <Text style={styles.userName}>
            {item.name} {isCurrentUser && "(You)"}
          </Text>
          <Text style={styles.userGender}>
            {item.gender}
          </Text>
        </View>
        
        <View style={styles.progressColumn}>
          <Text style={styles.scoreText}>{item.totalScore}</Text>
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
              keyExtractor={(item) => item.id.toString()}
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
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No rankings available yet</Text>
                </View>
              }
              ListFooterComponent={
                <View style={styles.footerContainer}>
                  <Text style={styles.footerText}>
                    * The Progress shows Total Score (Current Learning) (Finished)
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
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A80F0',
    marginBottom: 4,
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