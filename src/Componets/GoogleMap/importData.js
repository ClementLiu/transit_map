import React from "react";
import line_pattern from "data/line_pattern";
import bus_stops from "data/bus_stops";
import real_time from "data/real-time";
function getLocationByLine() {
  const locationsArray = [];
  const stopPointsPatterns =
    line_pattern.journeyPatterns[0].PointsInSequence.StopPointInJourneyPattern; // get stopPointsID
  const scheduledStopPoints = bus_stops.Contents.dataObjects.ScheduledStopPoint; // get get stopPointLocation
  //   const stopPointArray = [];
  stopPointsPatterns.forEach((elementstopPointsPatterns, index) => {
    // stopPointArray.push(elementstopPointsPatterns.ScheduledStopPointRef);
    scheduledStopPoints.forEach((element) => {
      // element.id === testId && console.log(element.Location);
      if (element.id === elementstopPointsPatterns.ScheduledStopPointRef) {
        // console.log(
        //   elementstopPointsPatterns.ScheduledStopPointRef,
        //   ":",
        //   element.Location
        // );
        locationsArray.push({
          id: [elementstopPointsPatterns.ScheduledStopPointRef],
          location: element.Location,
        });
      }
      // console.log("element.id.", element.id);
    });
  });
  //   console.log("locationsArray", locationsArray);
  return locationsArray;
}
function getRealTimeBusLocationByLine() {
  const linRef = 19;
  const busLocations = [];
  console.log("real_time1", real_time.Siri);
  const busJourneies =
    real_time.Siri.ServiceDelivery.VehicleMonitoringDelivery.VehicleActivity;
  busJourneies.forEach((element, index) => {
    element.MonitoredVehicleJourney.LineRef == linRef &&
      busLocations.push({
        index: index,
        location: {
          lat: parseFloat(
            element.MonitoredVehicleJourney.VehicleLocation.Latitude
          ),
          lng: parseFloat(
            element.MonitoredVehicleJourney.VehicleLocation.Longitude
          ),
        },
      });
  });
  console.log("busLocations", busLocations);
  return busLocations;
}
function importData() {
  getLocationByLine();
  return <div>In data</div>;
}

export default importData;
export { getLocationByLine, getRealTimeBusLocationByLine };
