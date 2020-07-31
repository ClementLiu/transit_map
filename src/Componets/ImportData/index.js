import React from "react";
import {
  getRealTimeBusLocationByLine,
  getLocationByLine,
  getBusLinesByAgency,
  getBusLocationByAgency,
} from "./importData";

function index() {
  return <div></div>;
}

export default index;
export {
  getLocationByLine,
  getBusLinesByAgency,
  getBusLocationByAgency,
  getRealTimeBusLocationByLine,
};
