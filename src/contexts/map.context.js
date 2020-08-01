import React, { createContext, useReducer } from "react";

export const MapContext = createContext();
export const MapDispatchContext = createContext();

function mapStateReducer(state, action) {
  switch (action.type) {
    case "SELECTBUS":
      console.log("in SLECBUS", action.lineId);
      return {
        ...state,
        lineId: action.lineId,
        initLoading: true,
        loaded: false,
        isResponse: false,
        response: null,
      };
    case "CALLBACK":
      return {
        ...state,
        response: action.response,
        initLoading: false,
        loaded: false,
        isResponse: true,
      };
    case "ONLOAD":
      return {
        ...state,
        loaded: true,
      };

    default:
      return state;
  }
}

export function QueriesProvider(props) {
  const [mapState, mapStateDispatch] = useReducer(mapStateReducer, {
    state: "",
    lineId: -1,
    initLoading: false,
    loaded: false,
    isResponse: false,
    response: null,
  });

  return (
    <MapContext.Provider value={mapState}>
      <MapDispatchContext.Provider value={mapStateDispatch}>
        {props.children}
      </MapDispatchContext.Provider>
    </MapContext.Provider>
  );
}
