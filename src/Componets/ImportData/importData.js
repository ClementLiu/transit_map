import bus_stops from "data/bus_stops";
import real_time from "data/real-time";
import bus_lines from "data/bus_lines";
import axios from "axios";

async function getLocationByLine(lineID) {
  let busRes = await axios.get(
    `http://api.511.org/transit/patterns?api_key=${
      process.env.REACT_APP_511_API
    }&operator_id=${"AC"}&line_id=${lineID}`
  );
  console.log("res in import", busRes);
  const locationsArray = [];
  const stopPointsPatterns =
    busRes.data.journeyPatterns[0].PointsInSequence.StopPointInJourneyPattern; // get stopPointsID
  const scheduledStopPoints = bus_stops.Contents.dataObjects.ScheduledStopPoint; // get get stopPointLocation
  stopPointsPatterns.forEach((elementstopPointsPatterns, index) => {
    scheduledStopPoints.forEach((element) => {
      if (element.id === elementstopPointsPatterns.ScheduledStopPointRef) {
        locationsArray.push({
          id: [elementstopPointsPatterns.ScheduledStopPointRef],
          location: element.Location,
        });
      }
    });
  });
  console.log("locationsArray", locationsArray);
  return locationsArray;
}
async function getRealTimeBusLocationByLine(getlinRef) {
  let busRealtime = await axios.get(
    `http://api.511.org/transit/VehicleMonitoring?api_key=${process.env.REACT_APP_511_API}&agency=AC`
  );

  const linRef = getlinRef || 19;
  const busLocations = [];
  console.log("real_time1", real_time.Siri);
  const busJourneies =
    busRealtime.data.Siri.ServiceDelivery.VehicleMonitoringDelivery
      .VehicleActivity;
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
function getBusLinesByAgency(agencyName) {
  return bus_lines;
}
async function getBusLocationByAgency(agencyName) {
  let getBusLocationByAgencyRes = await axios.get(
    `http://api.511.org/transit/VehicleMonitoring?api_key=${process.env.REACT_APP_511_API}&agency=AC`
  );
  return getBusLocationByAgencyRes;
}

export {
  getLocationByLine,
  getRealTimeBusLocationByLine,
  getBusLinesByAgency,
  getBusLocationByAgency,
};
