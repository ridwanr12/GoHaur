import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import fonts from '../constants/styles';
import {feedbackService} from '../api';

const ReviewScreen = ({navigation, route}) => {
  const storeData = route.params?.storeData || {
    id: '1',
    name: 'Sate Joko Khas Haur Pancuh',
    location: 'Blok A No. 12',
    totalSold: '143 Item Terjual',
    rating: '4.5/5.0',
  };

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (!storeData.id) return;
        setLoading(true);
        const response = await feedbackService.getStoreFeedbacks(storeData.id);
        if (response.data && response.data.feedbacks) {
          setReviews(response.data.feedbacks);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [storeData.id]);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FF6B35" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Image
            source={require('../../assets/back.png')}
            style={styles.backButtonIcon}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Toko</Text>
      </View>

      {/* Store Info */}
      <View style={styles.storeInfoContainer}>
        <View style={styles.storeInfoLeft}>
          <Image
            source={require('../../assets/restaurant.png')}
            style={styles.storeImage}
          />
          <View style={styles.storeDetails}>
            <Text style={styles.storeName}>{storeData.name}</Text>
            <Text style={styles.storeLocation}>{storeData.location}</Text>
            <Text style={styles.storeSold}>{storeData.totalSold}</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>{storeData.rating}</Text>
          <Image
            source={require('../../assets/star.png')}
            style={styles.ratingStar}
          />
        </View>
      </View>

      <View style={styles.divider} />

      {/* Reviews Section */}
      <View style={styles.reviewsSection}>
        <Text style={styles.sectionTitle}>Semua Review</Text>

        {loading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#FF6B35" />
          </View>
        ) : reviews.length === 0 ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontFamily: fonts.poppinsRegular, color: '#666'}}>
              Belum ada review untuk toko ini.
            </Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {reviews.map(review => {
              const dateObj = new Date(review.created_at);
              const dateStr = !isNaN(dateObj.getTime())
                ? dateObj.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'Tanggal tidak diketahui';

              return (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Image
                      source={require('../../assets/profilePic.png')}
                      style={styles.reviewerImage}
                    />
                    <View style={styles.reviewerInfo}>
                      <Text style={styles.reviewerName}>
                        {review.User?.name || 'Anonim'}
                      </Text>
                      <Text style={styles.reviewText}>
                        {review.description}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.reviewFooter}>
                    <Text style={styles.reviewDate}>{dateStr}</Text>
                    <View style={styles.reviewRating}>
                      <Text style={styles.reviewRatingText}>
                        {review.rating}.0/5.0
                      </Text>
                      <Image
                        source={require('../../assets/star.png')}
                        style={styles.reviewStarIcon}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FF6B35',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    marginRight: 15,
  },
  backButtonIcon: {
    width: 12,
    height: 24,
    marginBottom: 5,
    tintColor: 'white',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontFamily: fonts.poppinsMedium,
  },
  storeInfoContainer: {
    backgroundColor: 'white',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  storeDetails: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
  },
  storeLocation: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
  },
  storeSold: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 25,
    right: 15,
  },
  ratingText: {
    fontSize: 16,
    fontFamily: fonts.poppinsBold,
    color: '#000',
    marginRight: 5,
  },
  ratingStar: {
    marginBottom: 8,
    width: 20,
    height: 20,
    color: '#FFD700',
  },
  starIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFD700',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  reviewsSection: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.poppinsBold,
    color: '#000',
    marginBottom: 15,
  },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
    marginBottom: 5,
  },
  reviewText: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#333',
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#666',
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRatingText: {
    fontSize: 14,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
    marginRight: 5,
  },
  reviewStarIcon: {
    width: 16,
    height: 16,
    marginBottom: 7,
    tintColor: '#FFD700',
  },
});

export default ReviewScreen;
