import React from "react";
import {
  GoogleMapComponent,
  getRealTimeBusLocationByLine,
} from "./Componets/GoogleMap";

function App() {
  getRealTimeBusLocationByLine();
  return (
    <div>
      {/* working */}
      <GoogleMapComponent></GoogleMapComponent>
    </div>
  );
}

export default App;
