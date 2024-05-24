import React, { useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import MapView, { Marker, Polygon, Polyline, mapKit, PROVIDER_GOOGLE } from 'react-native-maps';
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
  const [PolygonCoord, setPolygonCoord] = useState([])

  const onMapPress = (e) => {
    setPolylineCoords([])
    const newMarker = {
      coordinate: e.nativeEvent.coordinate,
      key: id++,
    };
    setMarkers([...markers, newMarker]);
    setPolylineCoords([...polylineCoords, e.nativeEvent.coordinate]);
  };

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
    setPolylineCoords([])
  };

  const saveCoordAndZone = async () => {

    if (markers.length > 0) {
      const markerData = markers.map((marker, index) => ({
        longitude: marker.coordinate.longitude,
        latitude: marker.coordinate.latitude,
        order: index,
      }));

      // Log marker coordinates
      console.log('Markers to be saved:');
      markerData.forEach((marker, index) => {
        console.log(`Marker ${index + 1}:`, marker);
      });
      setPolygonCoord(...PolygonCoord, [markerData])
      // Close the polyline by adding the first marker's coordinate at the end
      const closedPolylineCoords = [
        ...polylineCoords,
        polylineCoords[0],
      ];
      setPolylineCoords(closedPolylineCoords);

      try {
        console.log({ coordinates: markerData });
        fetch("http://192.168.100.11:3000/api/zones", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ coordinates: markerData }),
        }).then(res => res.json())
          .then(data => {
            setMarkers([]);
            setPolylineCoords([])
          })

      } catch (error) {
        console.error('Error saving data to database:', error);
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
        onPress={onMapPress}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.key}
            coordinate={marker.coordinate}
            pinColor='red'
            draggable
            onDragEnd={(e) => onMarkerDragEnd(e, marker.key)}
          />
        ))}

        <Polyline coordinates={polylineCoords} strokeColor="#FF0000" strokeWidth={2} />
        {PolygonCoord.map((coord, index) => (

          <Polygon
            coordinates={coord}
            key={index}
            fillColor="rgba(0, 200, 0, 0.5)" // Semi-transparent fill color
            strokeColor="rgba(0,0,0,0.5)" // Outline color
            strokeWidth={2}
          />
        ))}
      </MapView>
      <View style={styles.buttonContainer}>
        <Button title="Save" onPress={saveCoordAndZone} style={styles.button} />
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