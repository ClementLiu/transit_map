import React, { useState, useEffect } from "react";
import {
  getLocationByLine,
  getRealTimeBusLocationByLine,
} from "Componets/ImportData";
import { GoogleMapComponent } from "Componets/GoogleMap";
function Map(props) {
  console.log("props.lineId in Map", props.lineId);
  const [mapData, setmapData] = useState({
    origin: "",
    destination: "",
    center: { lat: 37.754225, lng: -122.447193 },
    locations: undefined,
    waypoints: [],
    busRealLocations: [],
  });
  const returnWaypoint = (res) => {
    console.log("in res ***", res);
    let newWayPoints = [];
    const waypointsNew = res.map((location) => ({
      location: {
        lat: parseFloat(location.location.Latitude),
        lng: parseFloat(location.location.Longitude),
      },
      stopover: false,
    }));
    if (waypointsNew.length > 25) {
      newWayPoints = [...waypointsNew];
      console.log("in res newWayPoints", newWayPoints);
      while (newWayPoints.length > 25) {
        let remove = Math.floor(
          Math.random() * Math.floor(newWayPoints.length)
        );
        if (remove !== 0 && remove !== newWayPoints.length - 1) {
          newWayPoints.splice(remove, 1);
        }
      }
    }
    console.log("newWayPoints", newWayPoints);
    return newWayPoints;
  };

  useEffect(() => {
    console.log("effect working");
    if (props.lineId !== -1) {
      getRealTimeBusLocationByLine(props.lineId).then((res) => {
        console.log("getRealTimeBusLocationByLine working in then", res);
        if (res.length !== 0) {
          setmapData({
            ...mapData,
            busRealLocations: res.map((buslocation) => ({
              location: buslocation.location,
            })),
          });
        }
      });
      getLocationByLine(props.lineId).then((res) => {
        console.log("effect working in then", res);
        if (res.length !== 0) {
          console.log("effect working in l200");
          console.log(" in map res", res);
          setmapData({
            ...mapData,
            locations: res,
            origin: {
              lat: parseFloat(res[0].location.Latitude),
              lng: parseFloat(res[0].location.Longitude),
            },
            destination: {
              lat: parseFloat(res[res.length - 1].location.Latitude),
              lng: parseFloat(res[res.length - 1].location.Longitude),
            },
            center: {
              lat: parseFloat(res[0].location.Latitude),
              lng: parseFloat(res[0].location.Longitude),
            },
            waypoints: returnWaypoint(res),
            busRealLocations: [],
          });
        }
      });
    }
  }, [props.lineId]);

  return (
    <div>
      <GoogleMapComponent
        origin={mapData.origin}
        destination={mapData.destination}
        waypoints={mapData.waypoints}
        center={mapData.center}
        busRealLocations={mapData.busRealLocations}
      ></GoogleMapComponent>
    </div>
  );
}

export default Map;
