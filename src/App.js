import React from "react";
import Dashboard from "./Componets/Dashboard";
import { QueriesProvider } from "contexts/Map.context";

function App() {
  return (
    <>
      <QueriesProvider>
        <Dashboard></Dashboard>
      </QueriesProvider>
    </>
  );
}

export default App;
