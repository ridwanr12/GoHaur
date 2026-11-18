import logger from '../utils/logger';
import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import fonts from '../constants/styles';
import notificationService from '../api/services/notificationService';
import orderService from '../api/services/orderService';
import {useAuth} from '../context/AuthContext';

const formatDate = value => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const NotificationScreen = ({navigation}) => {
  const {user} = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const roles = Array.isArray(user?.roles) ? user.roles : [];
  const isSeller = roles.includes('seller');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications({limit: 50});
      setNotifications(response?.data?.notifications || []);
    } catch (error) {
      logger.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', load);
    load();
    return unsubscribe;
  }, [navigation, load]);

  const handleOpen = async item => {
    try {
      if (!item.is_read) {
        await notificationService.markRead(item.id);
        setNotifications(prev =>
          prev.map(n => (n.id === item.id ? {...n, is_read: true} : n)),
        );
      }
    } catch (error) {
      logger.error('Failed to mark notification as read:', error);
    }

    if (!item.order_id) {
      return;
    }

    try {
      const response = await orderService.getOrderById(item.order_id);
      const order = response?.data?.order;
      if (!order) {
        return;
      }
      navigation.navigate(isSeller ? 'NewOrder' : 'CurrentOrder', {
        orderData: order,
      });
    } catch (error) {
      logger.error('Failed to open order from notification:', error);
    }
  };

  const handleMarkAll = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications(prev => prev.map(n => ({...n, is_read: true})));
    } catch (error) {
      logger.error('Failed to mark all notifications:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../../assets/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifikasi</Text>
        <TouchableOpacity onPress={handleMarkAll}>
          <Text style={styles.headerAction}>Tandai dibaca</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          onRefresh={load}
          refreshing={loading}
          ListEmptyComponent={
            <Text style={styles.empty}>Belum ada notifikasi.</Text>
          }
          renderItem={({item}) => (
            <TouchableOpacity
              style={[styles.card, !item.is_read && styles.cardUnread]}
              onPress={() => handleOpen(item)}>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.date}>{formatDate(item.created_at)}</Text>
              </View>
              <Text style={styles.message}>{item.message}</Text>
              {!item.is_read && <View style={styles.dot} />}
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F5F5'},
  header: {
    backgroundColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backIcon: {width: 24, height: 24, tintColor: '#fff'},
  headerTitle: {color: '#fff', fontSize: 18, fontFamily: fonts.poppinsBold},
  headerAction: {color: '#fff', fontSize: 12, fontFamily: fonts.poppinsMedium},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  list: {padding: 16},
  empty: {textAlign: 'center', marginTop: 40, color: '#666'},
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  cardUnread: {borderLeftWidth: 4, borderLeftColor: '#FF6B35'},
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {fontFamily: fonts.poppinsBold, fontSize: 14, flex: 1, marginRight: 8},
  date: {fontFamily: fonts.poppinsRegular, fontSize: 11, color: '#888'},
  message: {fontFamily: fonts.poppinsRegular, fontSize: 13, color: '#444'},
  dot: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B35',
  },
});

export default NotificationScreen;
