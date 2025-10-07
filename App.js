import React, { useState, useEffect } from "react";
import { 
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  ActivityIndicator
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GOOGLE_MAPS_API_KEY } from '@env';
import * as Location from 'expo-location';

export default function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapRegion, setMapRegion] = useState({
    latitude: -23.55052,
    longitude: -46.633308,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    obterLocalizacao();
  }, []);

  const obterLocalizacao = async () => {
    try {
      // Pedir permissão
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        console.log('Permissão negada');
        setLoading(false);
        return;
      }

      // Obter localização atual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      setUserLocation(location.coords);
      
      // Centralizar mapa na localização do usuário
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      setLoading(false);
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      setLoading(false);
    }
  };

  const voltarParaMinhaLocalizacao = () => {
    if (userLocation) {
      setMapRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <MapView 
          style={styles.map}
          region={mapRegion}
          showsUserLocation={true}
          showsMyLocationButton={false}
          followsUserLocation={false}
        >
          {/* Marcador de São Paulo */}
          <Marker
            coordinate={{ latitude: -23.55052, longitude: -46.633308 }}
            title={"São Paulo"}
            description={"Capital financeira do Brasil"}
            pinColor="red"
          />

          {/* Marcador da localização do usuário */}
          {userLocation && (
            <Marker
              coordinate={{ 
                latitude: userLocation.latitude, 
                longitude: userLocation.longitude 
              }}
              title={"Você está aqui!"}
              description={`Lat: ${userLocation.latitude.toFixed(4)}, Lng: ${userLocation.longitude.toFixed(4)}`}
              pinColor="blue"
            />
          )}
        </MapView>

        {/* Botão para centralizar na localização do usuário */}
        {userLocation && (
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={voltarParaMinhaLocalizacao}
          >
            <Text style={styles.buttonText}>📍 Minha Localização</Text>
          </TouchableOpacity>
        )}

        {/* Loading */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4285F4" />
            <Text style={styles.loadingText}>Obtendo localização...</Text>
          </View>
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  locationButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#4285F4',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
});