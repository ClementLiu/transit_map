import React from "react";
import { MapContext } from "contexts/Map.context";
import { ReactTabulator } from "react-tabulator";
function StopInfo({
  timediffer,
  origiLocations,
  destinationLocation,
  busSpeedCallRes,
}) {
  console.log(
    "timediffer, origiLocations, destinationLocation",
    timediffer,
    origiLocations,
    destinationLocation,
    busSpeedCallRes
  );

  // var data = [];
  const originLocationGPS = [];
  const originLocationName = [];
  const destinLocationGPS = [];
  const destinLocationName = [];
  if (origiLocations.length !== 0) {
    origiLocations.forEach((element, index) => {
      originLocationGPS.push(element.location);
      originLocationName.push(element.stopName);
    });
  }
  if (destinationLocation.length !== 0) {
    destinationLocation.forEach((element, index) => {
      destinLocationGPS.push(element.location);
      destinLocationName.push(element.stopName);
    });
  }
  const data = timediffer.map((timediffer, index) => {
    console.log("busSpeedCallRes in stopInfo", busSpeedCallRes, index);
    console.log("originLocationName[index]", originLocationName[index]);
    console.log("timediffer", timediffer);
    return {
      distance:
        busSpeedCallRes.rows !== undefined
          ? busSpeedCallRes.rows[index].elements[index].distance.text
          : [],
      originLocationName: originLocationName[index],
      destinLocationName: destinLocationName[index],
      busSpeedCallRes:
        busSpeedCallRes.rows !== undefined
          ? `${
              Math.round(
                (busSpeedCallRes.rows[index].elements[index].distance.value /
                  timediffer) *
                  3.6 *
                  0.621371 *
                  100
              ) / 100
            } mph`
          : [],
      // .rows[index].elements[index].distance.text,
    };
  });
  const columns = [
    { title: "busSpeedCallRes", field: "busSpeedCallRes" },
    { title: "distance", field: "distance" },
    { title: "originLocationName", field: "originLocationName" },
    { title: "destinLocationName", field: "destinLocationName" },
  ];

  return (
    <div>
      <ReactTabulator
        data={data}
        columns={columns}
        tooltips={true}
        layout={"fitData"}
        responsiveLayout="hide"
      />
    </div>
  );
}

export default StopInfo;
