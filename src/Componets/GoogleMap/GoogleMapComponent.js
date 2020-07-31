import React, { useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

function GoogleMapComponent() {
  const [mapState, setmapState] = useState({
    response: null,
    travelMode: "DRIVING",
    origin: "",
    destination: "",
  });
  const containerStyle = {
    width: "100vw",
    height: "100vh",
  };

  const origin = {
    lat: 37.8714752,
    lng: -122.266502,
  };
  const destination = {
    lat: 37.072,
    lng: -122.214,
  };
  const waypoints = [
    { location: { lat: 37.172, lng: -122.214 }, stopover: false },
    { location: { lat: 37.272, lng: -122.214 }, stopover: false },
  ];
  // console.log(`${process.env.REACT_APP_MAP_KEY}`);

  const directionsCallback = (response) => {
    console.log("callback response");
    console.log(response);

    if (response !== null) {
      if (response.status === "OK") {
        setmapState({ ...mapState, response: response });
      } else {
        console.log("response: ", response);
      }
    }
  };
  console.log("working in map");
  return (
    <LoadScript googleMapsApiKey={`${process.env.REACT_APP_MAP_KEY}`}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={10}
        center={{
          lat: 37.8714752,
          lng: -122.266502,
        }}
        onLoad={(map) => {
          console.log("DirectionsRenderer onLoad map: ", map);
        }}
        // optional
        onUnmount={(map) => {
          console.log("DirectionsRenderer onUnmount map: ", map);
        }}
      >
        {mapState.destination !== "" &&
          mapState.origin !== "" &&
          mapState.response === null && (
            <DirectionsService
              options={{
                origin: mapState.origin,
                destination: mapState.destination,
                waypoints: mapState.waypoints,
                travelMode: "DRIVING",
                optimizeWaypoints: false,
                provideRouteAlternatives: false,
                avoidFerries: true,
                avoidHighways: false,
                avoidTolls: false,
                // region: String
              }}
              callback={directionsCallback}
              onLoad={(directionsService) => {
                console.log(
                  "DirectionsService onLoad directionsService: ",
                  directionsService
                );
              }}
              // optional
              onUnmount={(directionsService) => {
                console.log(
                  "DirectionsService onUnmount directionsService: ",
                  directionsService
                );
              }}
            ></DirectionsService>
          )}
        {mapState.response !== null && (
          <DirectionsRenderer
            options={{ directions: mapState.response }}
            onLoad={(directionsRenderer) => {
              console.log("mapState.response", mapState.response);
              console.log(
                "DirectionsRenderer onLoad directionsRenderer: ",
                directionsRenderer
              );
            }}
            // optional
            onUnmount={(directionsRenderer) => {
              console.log(
                "DirectionsRenderer onUnmount directionsRenderer: ",
                directionsRenderer
              );
            }}
          ></DirectionsRenderer>
        )}
        {/* Child components, such as markers, info windows, etc. */}
      </GoogleMap>
      <button
        onClick={() => {
          setmapState({
            ...mapState,
            origin: origin,
            destination: destination,
            waypoints: waypoints,
          });
        }}
      >
        Test
      </button>
    </LoadScript>
  );
}

export default React.memo(GoogleMapComponent);
