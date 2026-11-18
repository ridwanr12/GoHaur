import React, {useCallback, useMemo, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {getCurrentCoordinates} from '../utils/location';

const DEFAULT_CENTER = {latitude: -6.895, longitude: 107.618};

function buildMapHtml(center) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; }
    .hint { position: absolute; z-index: 999; left: 8px; right: 8px; top: 8px;
      background: rgba(255,255,255,0.92); padding: 8px 10px; border-radius: 8px;
      font-family: sans-serif; font-size: 12px; color: #333; }
  </style>
</head>
<body>
  <div class="hint">Geser peta atau ketuk untuk memilih titik</div>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    var map = L.map('map', { zoomControl: true }).setView([${center.latitude}, ${center.longitude}], 16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    var marker = L.marker([${center.latitude}, ${center.longitude}], { draggable: true }).addTo(map);

    function send(lat, lng) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ lat: lat, lng: lng }));
    }

    function update(lat, lng) {
      marker.setLatLng([lat, lng]);
      map.setView([lat, lng]);
      send(lat, lng);
    }

    window.setMarker = function(lat, lng) {
      marker.setLatLng([lat, lng]);
      map.setView([lat, lng], 16);
      send(lat, lng);
    };

    map.on('click', function(e) {
      marker.setLatLng(e.latlng);
      send(e.latlng.lat, e.latlng.lng);
    });

    marker.on('dragend', function() {
      var p = marker.getLatLng();
      send(p.lat, p.lng);
    });
  </script>
</body>
</html>`;
}

async function reverseGeocode(latitude, longitude) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
    const response = await fetch(url, {headers: {Accept: 'application/json'}});
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.display_name || null;
  } catch (error) {
    return null;
  }
}

/**
 * Modal peta OpenStreetMap untuk memilih titik (tanpa Google Maps / API key).
 */
const LocationPicker = ({visible, initial, onClose, onConfirm}) => {
  const start = initial && initial.latitude != null ? initial : DEFAULT_CENTER;
  const [point, setPoint] = useState({
    latitude: Number(start.latitude),
    longitude: Number(start.longitude),
  });
  const [isLocating, setIsLocating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const webViewRef = React.useRef(null);

  const html = useMemo(
    () => buildMapHtml({latitude: point.latitude, longitude: point.longitude}),
    // Sengaja hanya memakai titik awal; perubahan titik tidak boleh me-reload peta.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [visible],
  );

  const handleMessage = useCallback(event => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      setPoint({latitude: Number(data.lat), longitude: Number(data.lng)});
    } catch (error) {
      // abaikan pesan yang tidak valid
    }
  }, []);

  const handleUseCurrent = async () => {
    setIsLocating(true);
    try {
      const coords = await getCurrentCoordinates();
      setPoint(coords);
      webViewRef.current?.injectJavaScript(
        `window.setMarker(${coords.latitude}, ${coords.longitude}); true;`,
      );
    } catch (error) {
      Alert.alert(
        'Lokasi gagal',
        'Tidak bisa mengambil lokasi. Pastikan izin lokasi aktif dan GPS menyala.',
      );
    } finally {
      setIsLocating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const address = await reverseGeocode(point.latitude, point.longitude);
    setIsSaving(false);
    onConfirm?.({...point, address});
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.headerAction}>Batal</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pilih Titik Lokasi</Text>
          <TouchableOpacity onPress={handleSave} disabled={isSaving}>
            <Text style={styles.headerAction}>{isSaving ? '...' : 'Simpan'}</Text>
          </TouchableOpacity>
        </View>

        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{html}}
          onMessage={handleMessage}
          style={styles.map}
          javaScriptEnabled
          domStorageEnabled
          geolocationEnabled
        />

        <View style={styles.footer}>
          <Text style={styles.coords}>
            {point.latitude.toFixed(6)}, {point.longitude.toFixed(6)}
          </Text>
          <TouchableOpacity
            style={styles.currentButton}
            onPress={handleUseCurrent}
            disabled={isLocating}>
            {isLocating ? (
              <ActivityIndicator color="#FF6B35" />
            ) : (
              <Text style={styles.currentButtonText}>Gunakan Lokasi Saya</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FF6B35',
  },
  headerTitle: {color: '#fff', fontWeight: 'bold', fontSize: 16},
  headerAction: {color: '#fff', fontSize: 14},
  map: {flex: 1},
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  coords: {color: '#666', marginBottom: 8, textAlign: 'center'},
  currentButton: {
    borderWidth: 1,
    borderColor: '#FF6B35',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  currentButtonText: {color: '#FF6B35', fontWeight: 'bold'},
});

export default LocationPicker;
