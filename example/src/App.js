import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import GoogleMapReact from 'google-map-react'
// import 'google-map-react/dist/index.css'

import LOS_ANGELES_CENTER from './const/la_center';

import Marker from './components/Marker';

const Wrapper = styled.main`
  width: 100%;
  height: 100%;
`;

const App = () => {
  const [places, setPlaces] = useState([])

  const fetchPlaces = async () => {
    fetch('places.json')
    .then((response) => response.json())
    .then((data) => setPlaces(data.results))
  }

  useEffect(() => {
    fetchPlaces();
  }, [])

  if (!places || places.length === 0) {
    return null;
  }

  return (
    <Wrapper>
      <GoogleMapReact
        defaultZoom={10}
        defaultCenter={LOS_ANGELES_CENTER}
      >
        {places.map((place) => (
          <Marker
            key={place.id}
            text={place.name}
            lat={place.geometry.location.lat}
            lng={place.geometry.location.lng}
          />
        ))}
      </GoogleMapReact>
    </Wrapper>
  )
}

export default App
