import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import markerIcon from './markerIcon.png';
import MapView, { Marker, Polyline, mapKit } from 'react-native-maps';
const fetch = require('node-fetch');

const LATITUDE = 31.63416;
const LONGITUDE = -7.99994;
const LATITUDE_DELTA = 0.1;
const LONGITUDE_DELTA = 0.1;

let id = 0;
const GoogleMapsScreen = () => {
  const [region, setRegion] = useState({
    latitude: LATITUDE,
    longitude: LONGITUDE,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
 
  const [markers, setMarkers] = useState([]);
  const [polylineCoords, setPolylineCoords] = useState([]);

  // setting markers
  const onMapPress = (e) => {
    const newMarker = {
      coordinate: e.nativeEvent.coordinate,
      key: id++,
    };
    setMarkers([...markers, newMarker]);
    setPolylineCoords([...polylineCoords, e.nativeEvent.coordinate]);
    console.log('New Marker Added:', newMarker);
  };
  // drag marker 
  const onMarkerDragEnd = (e, markerKey) => {
    const newCoordinate = e.nativeEvent.coordinate;
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.key === markerKey
          ? { ...marker, coordinate: newCoordinate }
          : marker
      )
    );
    setPolylineCoords((prevCoords) =>
      prevCoords.map((coord, index) =>
        markers[index]?.key === markerKey ? newCoordinate : coord
      )
    );
  };

  // save coordinates
  const saveCoord = async () => {
    if (markers.length > 0) {
      const markerData = markers.map((marker, index) => {
        const data = {
          longitude: marker.coordinate.longitude,
          latitude: marker.coordinate.latitude,
          order: index,
        };
        console.log('Marker Data:', data);
        return data;
      });
      
         // Close the polyline by adding the first marker's coordinate at the end
         const closedPolylineCoords = [
          ...polylineCoords,
          polylineCoords[0],
        ];
        setPolylineCoords(closedPolylineCoords);

      // Post marker data to your database
      try {
        const apiUrl = 'http://192.168.1.101:3000/api/coordinates';

        const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(markerData),
      });


        if (response.ok) {
          console.log('Markers saved to database successfully.');
        } else {
          console.error('Failed to save markers to database.');
        }
      } catch (error) {
        console.error('Error saving markers to database:', error);
      }
    } else {
      console.log('No markers to save.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        provider={mapKit}
        initialRegion={region}
        onPress={(e) => onMapPress(e)}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.key}
            coordinate={marker.coordinate}
            pinColor='red'
            draggable
            onDragEnd={(e)=> onMarkerDragEnd(e,marker.key)}
          />
        ))}
        <Polyline coordinates={polylineCoords} strokeColor="#FF0000" strokeWidth={2} />
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={saveCoord} style={styles.button} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginBottom: 25,
  },
  button: {
    fontSize: 20,
  },
  text: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default GoogleMapsScreen;
