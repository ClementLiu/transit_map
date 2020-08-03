import React, { useState, useContext } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsService,
  DirectionsRenderer,
  DistanceMatrixService,
} from "@react-google-maps/api";
import { MapContext, MapDispatchContext } from "contexts/Map.context";

function GoogleMapComponent({
  origin,
  destination,
  waypoints,
  center,
  busRealLocations,
  timediffer,
  origiLocations,
  destinationLocation,
  isSpeedCallback,
  isBusStopGet,
}) {
  const mapContextState = useContext(MapContext);
  const mapContextDispatch = useContext(MapDispatchContext);
  console.log("center In component", center);

  console.log("origiLocations in google map", origiLocations);
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
  const distanceCallback = (response) => {
    console.log("distance callback response", response);

    if (response !== null) {
      console.log("distance callback not null", response);
      mapContextDispatch({ type: "SPEEDCALLBACK", speedCallRes: response });
    }
  };
  console.log("mapContextState.response", mapContextState.response);
  console.log(
    `origiLocations.map((origiLocation) => ({
    lat: parseFloat(origiLocation.location.Latitude),
    lng: parseFloat(origiLocation.location.Longitude),
  }))`,
    origiLocations.map((origiLocation) => ({
      lat: parseFloat(origiLocation.location.Latitude),
      lng: parseFloat(origiLocation.location.Longitude),
    }))
  );

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
          {!isSpeedCallback && origiLocations.length !== 0 && isBusStopGet ? (
            <DistanceMatrixService
              options={{
                origins: origiLocations.map((origiLocation) => ({
                  lat: parseFloat(origiLocation.location.Latitude),
                  lng: parseFloat(origiLocation.location.Longitude),
                })),
                destinations: destinationLocation.map((destination) => ({
                  lat: parseFloat(destination.location.Latitude),
                  lng: parseFloat(destination.location.Longitude),
                })),
                travelMode: "DRIVING",
                drivingOptions: {
                  departureTime: new Date(),
                  trafficModel: "bestguess",
                },
                avoidHighways: false,
                avoidTolls: false,
              }}
              callback={distanceCallback}
              // already get the OnwardCalls cross reference location and send to google map.
            ></DistanceMatrixService>
          ) : (
            console.log("distance finished")
          )}

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
            console.log("busRealLocation in marker", busRealLocation);
            return (
              <Marker
                key={index}
                position={busRealLocation}
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
