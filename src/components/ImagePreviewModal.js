import React from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {resolveImageUrl} from '../utils/imageUrl';

/**
 * Modal fullscreen untuk melihat bukti pembayaran.
 */
const ImagePreviewModal = ({visible, uri, onClose}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.flex} activeOpacity={1} onPress={onClose}>
          {uri ? (
            <Image
              source={{uri: resolveImageUrl(uri)}}
              style={styles.image}
              resizeMode="contain"
            />
          ) : null}
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Tutup</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {flex: 1, backgroundColor: 'rgba(0,0,0,0.92)'},
  flex: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  image: {width: '100%', height: '100%'},
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  closeText: {color: '#fff', fontWeight: 'bold'},
});

export default ImagePreviewModal;
