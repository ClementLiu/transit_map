import React, { useContext } from "react";
import { MapDispatchContext } from "contexts/map.context";
import "react-tabulator/lib/css/tabulator.css";
import { ReactTabulator } from "react-tabulator";
import {
  getLocationByLine,
  getBusLinesByAgency,
  getBusLocationByAgency,
} from "Componets/ImportData";

function Tabulator() {
  const pageDispatch = useContext(MapDispatchContext);
  const busesInfo = getBusLocationByAgency().Siri.ServiceDelivery
    .VehicleMonitoringDelivery.VehicleActivity;

  var data = [
    // { id: 1, name: "Oli Bob", age: "12", col: "red", dob: "", passed: "true" },
    // { id: 2, name: "Mary May", age: "1", col: "blue", dob: "14/05/1982" },
    // {
    //   id: 3,
    //   name: "Christine Lobowski",
    //   age: "42",
    //   col: "green",
    //   dob: "22/05/1982",
    // },
    // {
    //   id: 4,
    //   name: "Brendon Philips",
    //   age: "125",
    //   col: "orange",
    //   dob: "01/08/1980",
    // },
    // {
    //   id: 5,
    //   name: "Margret Marmajuke",
    //   age: "16",
    //   col: "yellow",
    //   dob: "31/01/1999",
    // },
  ];
  // console.log("busesInfo", busesInfo);

  busesInfo.forEach((element, index) => {
    // "RecordedAtTime": "2020-07-29T21:44:40Z",
    // "ValidUntilTime": "",
    // "MonitoredVehicleJourney": {
    //   "LineRef": "6",
    //   "DirectionRef": "N",
    //   "FramedVehicleJourneyRef": {
    //     "DataFrameRef": "2020-07-29",
    //     "DatedVehicleJourneyRef": "2463020"
    //   },
    //   "PublishedLineName": "Berkeley - Telegraph - Oakland",
    //   "OperatorRef": "AC",
    //   "OriginRef": "51636",
    //   "OriginName": "10th St + Washington St",
    //   "DestinationRef": "52842",
    //   "DestinationName": "Downtown Berkeley",
    //   "Monitored": true,
    //   "InCongestion": null,
    //   "VehicleLocation": {
    //     "Longitude": "-122.266502",
    //     "Latitude": "37.8714752"
    //   },
    //   "Bearing": "257.0000000000",
    //   "Occupancy": null,
    //   "VehicleRef": "10"
    // }
    const { RecordedAtTime } = element;
    const {
      LineRef,
      PublishedLineName,
      OriginRef,
      OriginName,
      DestinationRef,
      DestinationName,
      VehicleRef,
    } = element.MonitoredVehicleJourney;
    const {
      Longitude,
      Latitude,
    } = element.MonitoredVehicleJourney.VehicleLocation;
    data.push({
      RecordedAtTime,
      LineRef,
      PublishedLineName,
      OriginRef,
      OriginName,
      DestinationRef,
      DestinationName,
      VehicleRef,
      VehicleLocation: `${Longitude},${Latitude}`,
    });
  });
  const columns = [
    { title: "PublishedLineName", field: "PublishedLineName", width: 250 },
    { title: "VehicleRef", field: "VehicleRef", width: 100 },
    { title: "OriginName", field: "OriginName" },
    { title: "DestinationName", field: "DestinationName" },
    { title: "VehicleLocation", field: "VehicleLocation" },
    { title: "RecordedAtTime", field: "RecordedAtTime" },
    // { title: "Age", field: "age", hozAlign: "left", formatter: "progress" },
    // { title: "Date Of Birth", field: "dob", hozAlign: "center" },
    // { title: "Rating", field: "rating", hozAlign: "center", formatter: "star" },
    // {
    //   title: "Passed?",
    //   field: "passed",
    //   hozAlign: "center",
    //   formatter: "tickCross",
    // },
  ];
  const handleClick = (e, row) => {
    // console.log("row ", row._row.data);
    const { LineRef, VehicleRef } = row._row.data;
    console.log("LineRef,VehicleRef ", LineRef, VehicleRef);
    pageDispatch({
      type: "SELECTBUS",
      LineRef: LineRef,
    });
  };
  const handleClickTest = () => {
    console.log("handleClickTest");
  };
  return (
    <>
      <button onClick={handleClickTest}>Test</button>
      <ReactTabulator
        data={data}
        columns={columns}
        tooltips={true}
        layout={"fitData"}
        responsiveLayout="hide"
        rowClick={handleClick}
      />
    </>
  );
}

export default Tabulator;
