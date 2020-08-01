import React, { useState, useContext } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { MapContext, MapDispatchContext } from "contexts/Map.context";

function GoogleMapComponent({
  origin,
  destination,
  waypoints,
  center,
  busRealLocations,
}) {
  const mapContextState = useContext(MapContext);
  const mapContextDispatch = useContext(MapDispatchContext);
  console.log("center In component", center);

  console.log("origin", origin);
  // map setting

  const containerStyle = {
    width: "100%",
    height: "50vh",
  };
  // map function
  const directionsCallback = (response) => {
    console.log("callback response");
    console.log(response);
    if (response !== null) {
      if (response.status === "OK") {
        mapContextDispatch({ type: "CALLBACK", response: response });
      } else {
        console.log("response: ", response);
      }
    }
  };
  console.log("mapContextState.response", mapContextState.response);
  return (
    <LoadScript googleMapsApiKey={`${process.env.REACT_APP_MAP_KEY}`}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={12}
        center={center}
        onLoad={(map) => {
          console.log("DirectionsRenderer onLoad map: ", map);
        }}
        onUnmount={(map) => {
          console.log("DirectionsRenderer onUnmount map: ", map);
        }}
      >
        <>
          {destination !== "" &&
            origin !== "" &&
            mapContextState.initLoading === true && (
              <DirectionsService
                options={{
                  origin: origin,
                  destination: destination,
                  waypoints: waypoints,
                  travelMode: "DRIVING",
                  optimizeWaypoints: false,
                  provideRouteAlternatives: false,
                  avoidFerries: true,
                  avoidHighways: false,
                  avoidTolls: false,
                }}
                callback={directionsCallback}
                onLoad={(directionsService) => {
                  console.log(
                    "DirectionsService onLoad directionsService: ",
                    directionsService
                  );
                }}
                onUnmount={(directionsService) => {
                  console.log(
                    "DirectionsService onUnmount directionsService: ",
                    directionsService
                  );
                }}
              ></DirectionsService>
            )}
          {mapContextState.response !== null &&
            mapContextState.isResponse === true && (
              <DirectionsRenderer
                options={{ directions: mapContextState.response }}
                onLoad={(directionsRenderer) => {
                  console.log(
                    "mapContextState.response in render",
                    mapContextState.response
                  );
                  console.log(
                    "DirectionsRenderer onLoad directionsRenderer: ",
                    directionsRenderer
                  );
                }}
                onUnmount={(directionsRenderer) => {
                  console.log(
                    "DirectionsRenderer onUnmount directionsRenderer: ",
                    directionsRenderer
                  );
                }}
              ></DirectionsRenderer>
            )}
          {busRealLocations.map((busRealLocation, index) => {
            console.log("busRealLocation", busRealLocation);
            return (
              <Marker
                key={index}
                position={busRealLocation.location}
                icon={{
                  url: require("./assets/bus.svg"),
                }}
              ></Marker>
            );
          })}
        </>
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(GoogleMapComponent);
