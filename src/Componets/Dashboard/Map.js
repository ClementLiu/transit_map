import React, { useState } from "react";
import {
  getLocationByLine,
  getRealTimeBusLocationByLine,
} from "Componets/ImportData";
import { GoogleMapComponent } from "Componets/GoogleMap";
function Map(props) {
  if (props.vehicleRef === 19) {
  }
  const locations = props.vehicleRef === 19 ? getLocationByLine(19) : undefined; //get bus locations
  const waypoints =
    locations !== undefined
      ? locations.map((location) => ({
          location: {
            lat: parseFloat(location.location.Latitude),
            lng: parseFloat(location.location.Longitude),
          },
          stopover: false,
        }))
      : [];

  const origin =
    locations !== undefined
      ? {
          lat: parseFloat(locations[0].location.Latitude),
          lng: parseFloat(locations[0].location.Longitude),
        }
      : "";

  const destination =
    locations !== undefined
      ? {
          lat: parseFloat(locations[locations.length - 1].location.Latitude),
          lng: parseFloat(locations[locations.length - 1].location.Longitude),
        }
      : "";
  const center = { lat: 37.754225, lng: -122.447193 };
  const busRealLocations = [];

  return (
    <div>
      <GoogleMapComponent
        origin={origin}
        destination={destination}
        waypoints={waypoints}
        center={center}
        busRealLocations={busRealLocations}
      ></GoogleMapComponent>
    </div>
  );
}

export default Map;
