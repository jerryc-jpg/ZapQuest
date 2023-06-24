import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';


const containerStyle = {
  height: '100%'
};

const center = {
  lat: 41.8781,
  lng: -87.6298
};

function calcDistance(lat1, lng1, lat2, lng2) {
  const R = 3958.8;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng2);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

const Map = (props) => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const radius = props.radius || 20;
  const API_ENDPOINT = 'https://developer.nrel.gov/api/alt-fuel-stations/v1.geojson?api_key=SAXrq0f3rADebnnt4f9QIoAto2FAygasfxSySLne&fuel_type=ELEC&state=IL&limit=200&access_code=public&access_detail_code=RESIDENTIAL';

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_ENDPOINT);
        const filteredMarkers = response.data.features.filter((marker) => {
          const markerLat = marker.geometry.coordinates[1];
          const markerLng = marker.geometry.coordinates[0];
          const distance = calcDistance(center.lat, center.lng, markerLat, markerLng);
          return distance <= radius;
        });
        setMarkers(filteredMarkers);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyAFcX5Uw-P48huUIPGzpUV6v-NHhq1C3Zs"
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        {markers.map((marker, idx) => (
          <Marker
            key={idx}
            position={{
              lat: marker.geometry.coordinates[1],
              lng: marker.geometry.coordinates[0]
            }}
            onClick={() => handleMarkerClick(marker)}
          />
        ))}

        {selectedMarker && (
          <InfoWindow
            position={{
              lat: selectedMarker.geometry.coordinates[1],
              lng: selectedMarker.geometry.coordinates[0]
            }}
            onCloseClick={handleInfoWindowClose}
          >
            <div>
              <h3>{selectedMarker.properties.station_name}</h3>
              <p>{selectedMarker.properties.street_address}</p>
              {/* Display additional marker details */}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default React.memo(Map);