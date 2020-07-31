import React, { createContext, useReducer } from "react";

export const MapContext = createContext();
export const MapDispatchContext = createContext();

function mapStateReducer(state, action) {
  switch (action.type) {
    case "SELECTBUS":
      console.log("in SLECBUS", action.LineRef);
      return;

    default:
      return state;
  }
}

export function QueriesProvider(props) {
  const [mapState, mapStateDispatch] = useReducer(mapStateReducer, {
    state: "",
  });

  return (
    <MapContext.Provider value={mapState}>
      <MapDispatchContext.Provider value={mapStateDispatch}>
        {props.children}
      </MapDispatchContext.Provider>
    </MapContext.Provider>
  );
}
