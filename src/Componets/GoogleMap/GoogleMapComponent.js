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
  // console.log("waypoints", waypoints);
  // const locations = getLocationByLine(); //get bus locations
  // console.log(locations);

  // temp
  // const origin = {
  //   lat: 37.8714752,
  //   lng: -122.266502,
  // };
  // const destination = {
  //   lat: 37.072,
  //   lng: -122.214,
  // };
  // const onLoad = (marker) => {
  //   console.log("marker: ", marker);
  // };

  // console.log(`${process.env.REACT_APP_MAP_KEY}`);

  // console.log("busRealLocations", busRealLocations);

  // console.log("waypoints old", locations);
  // locations.forEach(
  //   (element, index) =>
  //     index !== 0 &&
  //     index !== locations.length - 1 &&
  //     waypoints.push({
  //       location: {
  //         lat: parseFloat(element.location.Latitude),
  //         lng: parseFloat(element.location.Longitude),
  //       },
  //       stopover: false,
  //     })
  // );

  // icon
  // console.log("working in map");
  // console.log("getRealTimeBusLocationByLine", getRealTimeBusLocationByLine());
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
        // optional
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
                  // mapContextDispatch({ type: "ONLOAD" });
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
          {busRealLocations.map((busRealLocation, index) => {
            console.log("busRealLocation", busRealLocation);
            return (
              <Marker
                key={index}
                position={busRealLocation.location}
                icon={{
                  url: require("./assets/bus.svg"),
                }}
                // draggable={true}
              ></Marker>
            );
          })}
        </>
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(GoogleMapComponent);
