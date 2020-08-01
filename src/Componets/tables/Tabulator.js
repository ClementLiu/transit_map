import React, { useContext, useEffect, useState } from "react";
import { MapDispatchContext } from "contexts/Map.context";
import "react-tabulator/lib/css/tabulator.css";
import { ReactTabulator } from "react-tabulator";
import { getBusLocationByAgency } from "Componets/ImportData";

function Tabulator() {
  const [busesInfo, setbusesInfo] = useState([]);
  const pageDispatch = useContext(MapDispatchContext);
  useEffect(() => {
    getBusLocationByAgency("AC").then((res) => {
      console.log("have res in AC");
      setbusesInfo(
        res.data.Siri.ServiceDelivery.VehicleMonitoringDelivery.VehicleActivity
      );
    });
  }, []);

  var data = [];

  busesInfo.forEach((element, index) => {
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
    { title: "LineRef", field: "LineRef" },
  ];
  const handleClick = (e, row) => {
    const { LineRef, VehicleRef } = row._row.data;
    console.log("LineRef,VehicleRef ", LineRef, VehicleRef);
    pageDispatch({
      type: "SELECTBUS",
      lineId: LineRef,
    });
  };
  const handleClickTest = () => {
    console.log("handleClickTest");
  };
  return (
    <>
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
