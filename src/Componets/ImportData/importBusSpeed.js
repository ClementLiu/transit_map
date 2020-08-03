import React from "react";

import route_timetable from "data/route_timetable";
import bus_stops from "data/bus_stops";

import {
  GoogleMap,
  LoadScript,
  DistanceMatrixService,
} from "@react-google-maps/api";
import axios from "axios";

function timeStringToFloat(time) {
  var hoursMinutesSecond = time.split(/[.:]/);
  var hours = parseInt(hoursMinutesSecond[0], 10);
  var minutes = hoursMinutesSecond[1] ? parseInt(hoursMinutesSecond[1], 10) : 0;
  var seconds = hoursMinutesSecond[2] ? parseInt(hoursMinutesSecond[2], 10) : 0;
  return hours * 3600 + minutes * 60 + seconds;
}
// get line schedule
function getScheduleByLine(line_id) {
  const timeTable = route_timetable.Content.TimetableFrame
    ? route_timetable.Content.TimetableFrame[0]
    : console.log("error getScheduleByLine");
  const stopPointsRef = timeTable.vehicleJourneys.ServiceJourney[0].calls.Call.map(
    (element, index) => element.ScheduledStopPointRef.ref
  );
  const arriveTimes = timeTable.vehicleJourneys.ServiceJourney[0].calls.Call.map(
    (element, index) => element.Arrival.Time
  );
  const departureTimes = timeTable.vehicleJourneys.ServiceJourney[0].calls.Call.map(
    (element, index) => element.Departure.Time
  );
  const timedifferSeconds = [];
  //   console.log("stopPointRef in busSpeed", stopPointRef);
  arriveTimes.forEach((element, index) => {
    if (index > 0) {
      timedifferSeconds.push(
        timeStringToFloat(element) -
          timeStringToFloat(departureTimes[index - 1])
      );
    }
  });
  console.log("stopPointRef", stopPointsRef);
  console.log("timedifferSeconds", timedifferSeconds);
  return {
    stopPointsRef,
    timedifferSeconds,
  };
}
async function getLocationsLocationNameByStopRef(stopPointsRef) {
  //   console.log("stopPointRef in getLocationsLocationNameByStopRef", stopPointsRef);
  //   console.log("bus_stop in getLocationsLocationNameByStopRef", bus_stops);
  let busStopsRes = await axios.get(
    `http://api.511.org/transit/stops?api_key=${process.env.REACT_APP_511_API}&operator_id=AC`
  );
  const stopPoints = stopPointsRef.map((stopPointRef) => ({
    stopName: busStopsRes.data.Contents.dataObjects.ScheduledStopPoint.filter(
      (element) => {
        return element.id === stopPointRef;
      }
    )[0].Name,
    location: busStopsRes.data.Contents.dataObjects.ScheduledStopPoint.filter(
      (element) => {
        return element.id === stopPointRef;
      }
    )[0].Location,
  }));
  console.log("stopPoints", stopPoints);
  return stopPoints;
}
// get distance with locations
function distanceMatrix(locations, timediffer) {
  const origiLocations = locations.slice(1);
  const destinationLocation = locations.slice(0, -1);
  console.log("origiLocations", origiLocations);
  console.log("destinationLocation", destinationLocation);
  console.log("timediffer", timediffer);
  return {
    timediffer,
    origiLocations,
    destinationLocation,
  };

  //   return [
  //     {
  //       origiLocations,
  //       destinationLocation,
  //       distance: 0,
  //     },
  //   ];
  //   return ["speed"];
}

function importBusSpeed(line_id) {
  getLocationsLocationNameByStopRef(
    getScheduleByLine(line_id).stopPointsRef
  ).then((res) => {
    const exportObject = distanceMatrix(
      res,
      getScheduleByLine(line_id).timedifferSeconds
    );
    return exportObject;
  });
  //   distanceMatrix();
  //   return <div></div>;
}

export default importBusSpeed;
export { importBusSpeed };
