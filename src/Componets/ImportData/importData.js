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
async function getRealTimeBusLocationsByLine(getlinRef) {
  let busRealtime = await axios.get(
    `http://api.511.org/transit/VehicleMonitoring?api_key=${process.env.REACT_APP_511_API}&agency=AC`
  );

  const linRef = getlinRef || 19;
  const busLocations = [];
  const busOnWardCalls = [];
  console.log("real_time1", real_time.Siri);
  const busJourneies =
    busRealtime.data.Siri.ServiceDelivery.VehicleMonitoringDelivery
      .VehicleActivity;
  busJourneies.forEach((element, index) => {
    if (element.MonitoredVehicleJourney.LineRef == linRef) {
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
      busOnWardCalls.push({
        VehicleRef: element.MonitoredVehicleJourney.VehicleRef,
        OnwardCall: element.MonitoredVehicleJourney.OnwardCalls.OnwardCall,
      });
    }
  });
  console.log("busLocations", busLocations);
  return busLocations;
}
async function getRealTimeBusLocationsByVehicleRefId(vehicleRefId) {
  let busRealtime = await axios.get(
    `http://api.511.org/transit/VehicleMonitoring?api_key=${process.env.REACT_APP_511_API}&agency=AC`
  );

  console.log(
    "vehicleRefId in getRealTimeBusLocationsByvehicleRefId",
    vehicleRefId
  );
  const vehicleRef = vehicleRefId || 19;
  console.log(
    "vehicleRef in getRealTimeBusLocationsByVehicleRefId",
    vehicleRef
  );
  const busLocations = [];
  const busOnWardCalls = [];
  console.log("real_time1", real_time.Siri);
  const busJourneies =
    busRealtime.data.Siri.ServiceDelivery.VehicleMonitoringDelivery
      .VehicleActivity;
  busJourneies.forEach((element, index) => {
    if (element.MonitoredVehicleJourney.VehicleRef == vehicleRef) {
      console.log(
        "busLocations pushing ",
        element.MonitoredVehicleJourney.VehicleLocation.Latitude
      );
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
      element.MonitoredVehicleJourney.OnwardCalls !== undefined &&
        busOnWardCalls.push(
          element.MonitoredVehicleJourney.OnwardCalls.OnwardCall
        );
    }
    console.log("busOnWardCalls", busOnWardCalls);
  });
  console.log("busLocations", busLocations);
  console.log("busOnWardCalls", busOnWardCalls);
  return { busLocations, busOnWardCalls };
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
  getRealTimeBusLocationsByLine,
  getRealTimeBusLocationsByVehicleRefId,
  getBusLinesByAgency,
  getBusLocationByAgency,
};
