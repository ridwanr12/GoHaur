import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import notificationService from '../api/services/notificationService';
import fonts from '../constants/styles';

/**
 * Ikon lonceng dengan badge jumlah notifikasi belum dibaca.
 */
const NotificationBell = ({navigation, tintColor = '#fff'}) => {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await notificationService.getUnreadCount();
        if (active) {
          setUnread(Number(response?.data?.unread) || 0);
        }
      } catch (error) {
        // diamkan; badge hanya informasi tambahan
      }
    };

    const unsubscribe = navigation.addListener('focus', load);
    load();

    return () => {
      active = false;
      unsubscribe();
    };
  }, [navigation]);

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
      <Image
        source={require('../../assets/notification.png')}
        style={[styles.icon, {tintColor}]}
      />
      {unread > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unread > 9 ? '9+' : unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {width: 20, height: 24, marginBottom: 5},
  badge: {
    position: 'absolute',
    right: -8,
    top: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: fonts.poppinsBold,
  },
});

export default NotificationBell;
