import React from "react";
import { GoogleMapComponent } from "./Componets/GoogleMap";
import Dashboard from "./Componets/Dashboard";
import { getRealTimeBusLocationByLine } from "./Componets/ImportData";
import { QueriesProvider } from "contexts/Map.context";

function App() {
  getRealTimeBusLocationByLine();
  return (
    <>
      <QueriesProvider>
        {/* working */}
        {/* <GoogleMapComponent></GoogleMapComponent> */}
        <Dashboard></Dashboard>
      </QueriesProvider>
    </>
  );
}

export default App;
