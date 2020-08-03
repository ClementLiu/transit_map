import React, { createContext, useReducer } from "react";

export const MapContext = createContext();
export const MapDispatchContext = createContext();
export const SpeedContext = createContext();
export const SpeedDispatchContext = createContext();

function mapStateReducer(state, action) {
  switch (action.type) {
    case "SELECTBUS":
      console.log("in SLECBUS", action.lineId);
      console.log("vehicleRef in context", action.vehicleRef);
      return {
        ...state,
        lineId: action.lineId,
        linevehicleRefId: action.vehicleRef,
        initLoading: true,
        isResponse: false,
        isSpeedCallback: false,
        readySpeed: true,
        response: null,
      };
    case "CALLBACK":
      return {
        ...state,
        response: action.response,
        initLoading: false,
        isResponse: true,
      };
    case "GETBUSTSTOP":
      return {
        ...state,
        isBusStopGet: true,
      };
    case "SPEEDCALLBACK": {
      console.log("in SPEEDCALLBACK", action.speedCallRes);
      return {
        ...state,
        isSpeedCallback: true,
        isBusStopGet: false,
        readySpeed: false,
        speedCallRes: action.speedCallRes,
      };
    }

    case "BUSTONWARD":
      console.log("action.selectedBusStops", action.selectedBusStops);
      return {
        ...state,
        selectedBusStops: action.selectedBusStops,
      };
    default:
      return state;
  }
}
// speed between stops
function speedStateReducer(state, action) {
  switch (action.type) {
    case "SELECTBUS":
      console.log("in SLECBUS", action.lineId);
      return {};
    case "CALLBACK":
      return {};
    default:
      return state;
  }
}

export function QueriesProvider(props) {
  const [mapState, mapStateDispatch] = useReducer(mapStateReducer, {
    state: "",
    lineId: -1,
    initLoading: false,
    isResponse: false,
    isSpeedCallback: true,
    readySpeed: false,
    response: null,
    linevehicleRefId: -1,
    selectedBusStops: [],
    speedCallRes: {},
    isBusStopGet: false,
  });
  const [speedState, speedStateDispatch] = useReducer(speedStateReducer, {});

  return (
    <MapContext.Provider value={mapState}>
      <MapDispatchContext.Provider value={mapStateDispatch}>
        <SpeedContext.Provider value={speedState}>
          <SpeedDispatchContext.Provider value={speedStateDispatch}>
            {props.children}
          </SpeedDispatchContext.Provider>
        </SpeedContext.Provider>
      </MapDispatchContext.Provider>
    </MapContext.Provider>
  );
}
