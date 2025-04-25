import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  Image,
  Text,
  View,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import fonts from '../constants/styles';
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

const pages = [
  {
    text: 'Pesan makanan di tempat kuliner terdekat dengan sekali klik!',
    image: require('../../assets/onb1.png'),
  },
  {
    text: 'Kelola menu dengan mudah, perbarui produk kapan saja.',
    image: require('../../assets/onb2.png'),
  },
  {
    text: 'Kurir siap antar pesanan, nikmati makanan tanpa repot!',
    image: require('../../assets/onb3.png'),
  },
];

// Komponen untuk menampilkan setiap slide
const OnboardingItem = ({item, index, x}) => {
  return (
    <View
      style={{
        width: SCREEN_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View>
        <View style={{height: 0}} />
        <Image
          source={item.image}
          style={{
            width: 400,
            height: 340,
            marginTop: -150,
            resizeMode: 'contain',
          }}
        />
        <Text
          style={{
            color: 'black',
            fontSize: 20,
            fontFamily: fonts.poppinsRegular,
            textAlign: 'center',
            marginHorizontal: 20,
            marginTop: -20,
          }}>
          {item.text}
        </Text>
      </View>
    </View>
  );
};

// Komponen untuk menampilkan indikator pagination
const Pagination = ({data, currentIndex}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {data.map((_, i) => {
        return (
          <View
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: i === currentIndex ? '#ff6b35' : '#ccc',
              margin: 5,
            }}
          />
        );
      })}
    </View>
  );
};

const OnboardingScreens = ({navigation}) => {
  const x = useSharedValue(0);
  const flatListRef = useAnimatedRef();
  const [currentIndex, setCurrentIndex] = useState(0);
  // const timerRef = useRef(null);

  // Fungsi untuk memperbarui currentIndex berdasarkan posisi scroll
  const updateCurrentIndex = useCallback(position => {
    const index = Math.round(position / SCREEN_WIDTH);
    setCurrentIndex(index);
  }, []);

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
      runOnJS(updateCurrentIndex)(event.contentOffset.x);
    },
  });

  const goToSlide = index => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: SCREEN_WIDTH * index,
        animated: true,
      });
    }
  };

  const handleNextSlide = () => {
    // // Reset timer saat tombol ditekan
    // clearInterval(timerRef.current);

    if (currentIndex < pages.length - 1) {
      goToSlide(currentIndex + 1);
      // // Mulai timer baru
      // startAutoSlide();
    } else {
      // Navigasi ke halaman berikutnya setelah onboarding
      navigation.replace('Signup'); // Ganti dengan nama screen tujuan Anda
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Animated.FlatList
        ref={flatListRef}
        data={pages}
        renderItem={({item, index}) => (
          <OnboardingItem item={item} index={index} x={x} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(item, index) => index.toString()}
      />

      <View
        style={{
          position: 'absolute',
          bottom: 30,
          left: 0,
          right: 0,
          alignItems: 'center',
        }}>
        {/* Tampilkan pagination hanya pada halaman 1 dan 2 */}
        {currentIndex < pages.length - 1 && (
          <Pagination data={pages} currentIndex={currentIndex} />
        )}

        {/* Tampilkan tombol hanya pada halaman terakhir */}
        {currentIndex === pages.length - 1 && (
          <TouchableOpacity
            onPress={handleNextSlide}
            style={{
              backgroundColor: '#ff6b35',
              width: 320,
              height: 65,
              marginTop: 0,
              marginBottom: 30,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 16,
                fontFamily: fonts.poppinsBold,
              }}>
              Mulai Sekarang
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreens;
