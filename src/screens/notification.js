import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import fonts from '../constants/styles';

const NotificationScreen = ({navigation}) => {
  // Data notifikasi contoh
  const notifications = [
    {
      id: 1,
      title: 'Sate Joko Khas Haur Pancuh',
      message: 'Pesanan Anda sedang dalam perjalanan',
      date: '21 Februari 2024',
    },
    {
      id: 2,
      title: 'Sate Joko Khas Haur Pancuh',
      message: 'Pesanan Anda sedang dalam perjalanan',
      date: '21 Februari 2024',
    },
    {
      id: 3,
      title: 'Sate Joko Khas Haur Pancuh',
      message: 'Pesanan Anda sedang dalam perjalanan',
      date: '21 Februari 2024',
    },
    {
      id: 4,
      title: 'Sate Joko Khas Haur Pancuh',
      message: 'Pesanan Anda sedang dalam perjalanan',
      date: '21 Februari 2024',
    },
    {
      id: 5,
      title: 'Sate Joko Khas Haur Pancuh',
      message: 'Pesanan Anda sedang dalam perjalanan',
      date: '21 Februari 2024',
    },
    {
      id: 6,
      title: 'Sate Joko Khas Haur Pancuh',
      message: 'Pesanan Anda sedang dalam perjalanan',
      date: '21 Februari 2024',
    },
    {
      id: 7,
      title: 'Sate Joko Khas Haur Pancuh',
      message: 'Pesanan Anda sedang dalam perjalanan',
      date: '21 Februari 2024',
    },
    {
      id: 8,
      title: 'Sate Joko Khas Haur Pancuh',
      message: 'Pesanan Anda sedang dalam perjalanan',
      date: '21 Februari 2024',
    },
    {
      id: 9,
      title: 'Sate Joko Khas Haur Pancuh',
      message: 'Pesanan Anda sedang dalam perjalanan',
      date: '21 Februari 2024',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FF6B35" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifikasi</Text>
      </View>

      {/* Daftar Notifikasi */}
      <ScrollView
        style={styles.notificationList}
        showsVerticalScrollIndicator={false}>
        {notifications.map(notification => (
          <View key={notification.id} style={styles.notificationItem}>
            <View style={styles.notificationContent}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationDate}>{notification.date}</Text>
            </View>
            <Text style={styles.notificationMessage}>
              {notification.message}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
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
  backButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontFamily: fonts.poppinsMedium,
  },
  notificationList: {
    flex: 1,
    padding: 15,
  },
  notificationItem: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  notificationContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  notificationTitle: {
    fontSize: 14,
    fontFamily: fonts.poppinsMedium,
    color: '#000',
  },
  notificationDate: {
    fontSize: 12,
    fontFamily: fonts.poppinsRegular,
    color: '#888',
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: fonts.poppinsRegular,
    color: '#000',
  },
});

export default NotificationScreen;
