"use strict";
// * utility
function timeStringToFloat(time) {
  var hoursMinutesSecond = time.split(/[.:]/);
  var hours = parseInt(hoursMinutesSecond[0], 10);
  var minutes = hoursMinutesSecond[1] ? parseInt(hoursMinutesSecond[1], 10) : 0;
  var seconds = hoursMinutesSecond[2] ? parseInt(hoursMinutesSecond[2], 10) : 0;
  return hours * 3600 + minutes * 60 + seconds;
}
// * getbus list
function getBusList(operatorId) {
  const token = "YOUR 511 KEY HERE";
  var image =
    "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
  $.ajax({
    url: `http://api.511.org/transit/lines?api_key=${token}&operator_id=${operatorId}`,
    success: function (lines) {
      const operatorList = [];
      if (lines !== null) {
        console.log("lines", lines);
        const idarray = [];
        const namearray = [];
        var tabledata = [];
        lines.forEach((line) => {
          const { Id: id, Name: name, TransportMode: mode } = line;
          tabledata.push({
            id,
            name,
          });
        });
        console.log("tabledata", tabledata);

        var table = new Tabulator("#example-table", {
          data: tabledata,
          autoColumns: true,
          height: "300px",

          rowClick: function (e, row) {
            console.log("row", row._row.data);
            const line_id = row._row.data.id;
            console.log("e", e);
            //e - the click event object
            //row - row component
            $.ajax({
              url: `http://api.511.org/transit/patterns?api_key=${token}&operator_id=${operatorId}&line_id=${line_id}`,
              success: function (line_data) {
                console.log("line_data", line_data);
                if (line_data.journeyPatterns.length !== 0) {
                  const stopPoints =
                    line_data.journeyPatterns[0].PointsInSequence
                      .StopPointInJourneyPattern;
                  // const stopPointsRefs = stopPoints.ScheduledStopPointRef;
                  console.log("stopPoints", stopPoints);
                  const ScheduledStopPoints = [];
                  // * get real time location
                  $.ajax({
                    url: `http://api.511.org/transit/VehicleMonitoring?api_key=${token}&agency=${operatorId}`,
                    success: function (vehicleRealTimeData) {
                      // const busRealTimeLocations = [];
                      // * extract busJourney
                      console.log("vehicleRealTimeData", vehicleRealTimeData);
                      const busJourneies =
                        vehicleRealTimeData.Siri.ServiceDelivery
                          .VehicleMonitoringDelivery.VehicleActivity;
                      // * extract locations
                      busJourneies.forEach((buJourney, index) => {
                        if (
                          buJourney.MonitoredVehicleJourney.LineRef == line_id
                        ) {
                          console.log(
                            "busRealTimeLocations pushing ",
                            buJourney.MonitoredVehicleJourney.VehicleLocation
                              .Latitude
                          );
                          var marker = new google.maps.Marker({
                            position: {
                              lat: parseFloat(
                                buJourney.MonitoredVehicleJourney
                                  .VehicleLocation.Latitude
                              ),
                              lng: parseFloat(
                                buJourney.MonitoredVehicleJourney
                                  .VehicleLocation.Longitude
                              ),
                            },
                            map: map,
                            icon: { url: "bus.svg" },
                          });
                          // * onward speed
                          // buJourney.MonitoredVehicleJourney.OnwardCalls !==
                          //   undefined &&
                          //   busOnWardCalls.push(
                          //     buJourney.MonitoredVehicleJourney.OnwardCalls
                          //       .OnwardCall
                          //   );
                        }
                        // console.log("busOnWardCalls", busOnWardCalls);
                      });
                    },
                  });
                  // * get route from pattern and google api
                  $.ajax({
                    url: `http://api.511.org/transit/stops?api_key=${token}&operator_id=${operatorId}&line_id=${line_id}`,
                    success: function (response) {
                      // const locations = [];
                      const waypoints = [];
                      const timedifferSeconds = [];
                      let stopPointsRefs;
                      const scheduledStopPoints =
                        response.Contents.dataObjects.ScheduledStopPoint;
                      console.log(
                        "response.Contents.dataObjects.ScheduledStopPoint",
                        response.Contents.dataObjects.ScheduledStopPoint
                      );
                      // todo get timeDiffer location from timetable
                      $.ajax({
                        url: `http://api.511.org/transit/timetable?api_key=${token}&operator_id=${operatorId}&line_id=${line_id}`,
                        success: function (timetables) {
                          console.log("timetables", timetables);
                          const timeTable = timetables.Content.TimetableFrame
                            ? timetables.Content.TimetableFrame[0]
                            : console.log("error getScheduleByLine");
                          console.log("timeTable", timeTable);
                          const stopInformationFromTimeTable = [];
                          const arriveTimes = timeTable.vehicleJourneys.ServiceJourney[0].calls.Call.map(
                            (element, index) => element.Arrival.Time
                          );
                          const departureTimes = timeTable.vehicleJourneys.ServiceJourney[0].calls.Call.map(
                            (element, index) => element.Departure.Time
                          );
                          stopPointsRefs = timeTable.vehicleJourneys.ServiceJourney[0].calls.Call.map(
                            (element, index) =>
                              element.ScheduledStopPointRef.ref
                          );
                          arriveTimes.forEach((element, index) => {
                            if (index > 0) {
                              timedifferSeconds.push(
                                timeStringToFloat(element) -
                                  timeStringToFloat(departureTimes[index - 1])
                              );
                            }
                          });
                          // * extract location GPS and name
                          stopPointsRefs.forEach((stopPointsRef) => {
                            scheduledStopPoints.forEach(
                              (scheduledStopPoint) => {
                                console.log("stopPointsRef", stopPointsRef);
                                console.log(
                                  "scheduledStopPoint",
                                  scheduledStopPoint.id
                                );
                                const scheduledStopointId =
                                  scheduledStopPoint.id;
                                if (stopPointsRef == scheduledStopointId) {
                                  console.log(
                                    "scheduledStopPoint for schedule",
                                    scheduledStopPoint
                                  );
                                  const {
                                    Location: location,
                                    Name: name,
                                    id,
                                  } = scheduledStopPoint;
                                  stopInformationFromTimeTable.push({
                                    location,
                                    name,
                                    id,
                                  });
                                }
                              }
                            );
                          });
                          // todo calculate distance
                          var service = new google.maps.DistanceMatrixService();
                          const origiLocations = stopInformationFromTimeTable
                            .slice(1)
                            .map((el) => el.location);
                          console.log("origiLocations", origiLocations);
                          const destinationLocation = stopInformationFromTimeTable
                            .slice(0, -1)
                            .map((el) => el.location);
                          service.getDistanceMatrix(
                            {
                              origins: origiLocations.map((origiLocation) => ({
                                lat: parseFloat(origiLocation.Latitude),
                                lng: parseFloat(origiLocation.Longitude),
                              })),
                              destinations: destinationLocation.map(
                                (destination) => ({
                                  lat: parseFloat(destination.Latitude),
                                  lng: parseFloat(destination.Longitude),
                                })
                              ),
                              travelMode: "DRIVING",
                              drivingOptions: {
                                departureTime: new Date(),
                                trafficModel: "bestguess",
                              },
                              avoidHighways: false,
                              avoidTolls: false,
                            },
                            (response) => {
                              console.log(
                                "distance callback response",
                                response
                              );
                              // * set up table
                              //define data
                              var tabledataSpeed = response.rows.map(
                                (el, index) => {
                                  return {
                                    distance: el.elements[index].distance.text,
                                    originLocationName:
                                      stopInformationFromTimeTable[index].name,
                                    destinLocationName:
                                      stopInformationFromTimeTable[index + 1]
                                        .name,
                                    busSpeedCallRes: `${
                                      Math.round(
                                        (el.elements[index].distance.value /
                                          timedifferSeconds[index]) *
                                          3.6 *
                                          0.621371 *
                                          100
                                      ) / 100
                                    } mph`,
                                  };
                                }
                              );
                              // [
                              //   {
                              //     distance:
                              //       Object.keys(busSpeedCallRes).length !== 0
                              //         ? busSpeedCallRes.rows[index].elements[index].distance.text
                              //         : [],
                              //     originLocationName: originLocationName[index],
                              //     destinLocationName: destinLocationName[index],
                              //     busSpeedCallRes:
                              //       busSpeedCallRes.rows !== undefined
                              //         ? `${
                              //             Math.round(
                              //               (busSpeedCallRes.rows[index].elements[index].distance.value /
                              //                 timediffer) *
                              //                 3.6 *
                              //                 0.621371 *
                              //                 100
                              //             ) / 100
                              //           } mph`
                              //         : [],
                              //     // .rows[index].elements[index].distance.text,
                              //   },
                              // ];

                              //define table
                              var table = new Tabulator("#bus-speed-table", {
                                data: tabledataSpeed,
                                autoColumns: true,
                              });
                            }
                          );
                          // todo calculate speed
                          // todo create chart
                        },
                      });
                      stopPoints.forEach((stopPoint) => {
                        scheduledStopPoints.forEach((scheduledStopPoint) => {
                          if (
                            scheduledStopPoint.id ===
                            stopPoint.ScheduledStopPointRef
                          ) {
                            // console.log(
                            //   "scheduledStopPoint.Location",
                            //   scheduledStopPoint.Location
                            // );
                            // locations.push(scheduledStopPoint.Location);
                            waypoints.push({
                              location: new google.maps.LatLng(
                                parseFloat(
                                  scheduledStopPoint.Location.Latitude
                                ),
                                parseFloat(
                                  scheduledStopPoint.Location.Longitude
                                )
                              ),
                              stopover: true,
                            });

                            // console.log("element.ScheduledStopPointRef",element.ScheduledStopPointRef);
                          }
                        });
                      });
                      // scheduledStopPoints.forEach((scheduledStopPoint) => {
                      //   stopPoints.forEach((element) => {
                      //     if (
                      //       element.ScheduledStopPointRef ===
                      //       scheduledStopPoint.id
                      //     ) {}
                      //   });
                      // });
                      // console.log("locations", locations);
                      // get direction service
                      // const waypoints = [];
                      // new google.maps.LatLng(2.8, -187.3);
                      let newWayPoints = [];
                      if (waypoints.length != 0) {
                        console.log("in res newWayPoints waypoints", waypoints);
                        newWayPoints = [...waypoints];
                        console.log("in res newWayPoints", newWayPoints);
                        if (waypoints.length > 25) {
                          while (newWayPoints.length > 25) {
                            let remove = Math.floor(
                              Math.random() * Math.floor(newWayPoints.length)
                            );
                            if (
                              remove !== 0 &&
                              remove !== newWayPoints.length - 1
                            ) {
                              newWayPoints.splice(remove, 1);
                            }
                          }
                        }
                        console.log(
                          "in res newWayPoints after trim newWayPoints",
                          newWayPoints
                        );
                        console.log(
                          "in res newWayPoints after trim",
                          newWayPoints[0]
                        );
                        var request = {
                          origin: newWayPoints[0].location,
                          destination:
                            newWayPoints[newWayPoints.length - 1].location,
                          travelMode: "DRIVING",
                          waypoints: newWayPoints,
                          optimizeWaypoints: false,
                          provideRouteAlternatives: false,
                          avoidFerries: true,
                          avoidHighways: false,
                          avoidTolls: false,
                          drivingOptions: {
                            departureTime: new Date(Date.now()), // for the time N milliseconds from now.
                            trafficModel: "optimistic",
                          },
                        };

                        directionsService.route(request, function (
                          result,
                          status
                        ) {
                          if (status == "OK") {
                            console.log("setDirection OK", result);
                            directionsRenderer.setOptions({
                              markerOptions: {
                                visible: false,
                              },
                            });
                            directionsRenderer.setDirections(result);
                          }
                        });
                      }

                      // scheduledStopPoints.push(response.Contents.dataObjects.ScheduledStopPoint);
                    },
                  });
                }
              },
            });
          },
        });
      }
      console.log("operatorList", operatorList);
      $("#operatorList").append(operatorList);

      console.log("lineso", lines);
    },
  });
}
$(document).ready(function () {
  $.ajax({
    url:
      "http://api.511.org/transit/operators?api_key=21931734-58f4-4f9b-ae64-abb9383ec986",
    success: function (operators) {
      const operatorList = [];
      if (operators !== null) {
        operators.forEach((operator) => {
          const { Id: id, Name: name, TimeZone: timeZone } = operator;
          console.log("timeZone", timeZone);
          operatorList.push(
            `<a class="dropdown-item operatorId" data-operatorid="${id}">${name}</a>`
          );
        });
      }
      // console.log("operatorList", operatorList);
      $("#operatorList").append(operatorList);
      $(".operatorId").click(function (e) {
        e.preventDefault();
        console.log("$( this ).slideUp();", $(this).data().operatorid);
        const operatorid = $(this).data().operatorid;
        getBusList(operatorid);
      });
      console.log("operatorso", operators);
    },
  });
});
// let map;
var map;
var service;
var directionsService;
var directionsRenderer;

function initMap() {
  service = new google.maps.DistanceMatrixService();
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: new google.maps.LatLng(37.754224, -122.447137),
    // mapTypeId: "satellite",
  });
  directionsRenderer.setMap(map);
}

function calcRoute() {
  var start = document.getElementById("start").value;
  var end = document.getElementById("end").value;
  var request = {
    origin: start,
    destination: end,
    travelMode: "DRIVING",
  };
  directionsService.route(request, function (result, status) {
    if (status == "OK") {
      directionsRenderer.setDirections(result);
    }
  });
}

// $.ajax({
//   url:
//     "http://api.511.org/transit/timetable?api_key=21931734-58f4-4f9b-ae64-abb9383ec986&operator_id=AC&line_id=19",
//   success: function (result) {
//     console.log(result);
//   },
// });
