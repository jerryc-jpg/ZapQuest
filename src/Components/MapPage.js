import React, {useEffect, useRef, useState} from 'react'
import axios from 'axios';
import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';

import geojsonData from 'raw-loader!./data_IL.geojson'

const containerStyle = {
  height: '100%'
};

const center = {
  lat: 41.8781,
  lng: -87.6298
};

const Map = (props) => {
  const [selectedMarker, setSelectedMarker] = useState(null)

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker)
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
        { /* Child components, such as markers, info windows, etc. */ }
        {JSON.parse(geojsonData).features.map((feature, idx) => (
          <Marker
            key={idx}
            position={{
              lat: feature.geometry.coordinates[1],
              lng: feature.geometry.coordinates[0]
            }}
            onClick={() => handleMarkerClick(feature)}
          />
        ))} 

        {selectedMarker && (
          <InfoWindow
            position={{
              lat: selectedMarker.geometry.coordinates[1],
              lng: selectedMarker.geometry.coordinates[0],
            }}
            onCloseClick={handleInfoWindowClose}
          >
            <div>
              <h3>{selectedMarker.properties.station_name}</h3>
              <p>{selectedMarker.properties.street_address}</p>
            </div>
          </InfoWindow>
        )}
        
      </GoogleMap>
    </LoadScript>
  )
}

export default React.memo(Map)