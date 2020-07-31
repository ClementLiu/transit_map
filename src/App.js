import React from "react";
import {
  GoogleMapComponent,
  getRealTimeBusLocationByLine,
} from "./Componets/GoogleMap";
import Dashboard from "./Componets/Dashboard";

function App() {
  getRealTimeBusLocationByLine();
  return (
    <div>
      {/* working */}
      {/* <GoogleMapComponent></GoogleMapComponent> */}
      <Dashboard></Dashboard>
    </div>
  );
}

export default App;
