import React, { useContext, useState, useEffect } from "react";
import {
  Nav,
  Card,
  Button,
  Container,
  Col,
  Row,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import { MapContext, MapDispatchContext } from "contexts/Map.context";

import { BusInfo, StopInfo } from "Componets/tables";
import Map from "./Map";
import { importBusSpeed } from "Componets/ImportData";

function Dashboard() {
  const mapState = useContext(MapContext);
  const mapDispatch = useContext(MapDispatchContext);
  console.log("mapState", mapState);
  const [state, setState] = useState({
    timediffer: [],
    origiLocations: [],
    destinationLocation: [],
    isTableReady: false,
  });
  useEffect(() => {
    if (mapState.lineId !== -1) {
      console.log("being res in mapState.lineId", mapState.lineId);
      importBusSpeed(mapState.lineId).then((res) => {
        if (res !== undefined) {
          console.log("being res in dashboard", res);
          const { timediffer, origiLocations, destinationLocation } = res;
          console.log(
            "being res in dashboard Value",
            timediffer,
            origiLocations,
            destinationLocation
          );
          mapDispatch({ type: "GETBUSTSTOP" });
          setState({
            timediffer: timediffer,
            origiLocations: origiLocations,
            destinationLocation: destinationLocation,
            isTableReady: true,
          });
        }
      });
    }
  }, [mapState.lineId]);
  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#hashLink">Looking Bus</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#hashLinkone">Title one</Nav.Link>
            <Nav.Link href="#hashLinktwo">Title two</Nav.Link>
            <NavDropdown title="Something more" id="basic-nav-dropdown">
              <NavDropdown.Item href="#num/3.1415926">
                Here I am
              </NavDropdown.Item>
              <NavDropdown.Item href="#num/2.33333">
                I'm Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#eyes/3.3">
                I am Something else
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#start/1.01010101">
                Separated but not lonely
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container fluid="md" className="mt-5">
        <Row>
          <Col xs={12}>
            <Card style={{ width: "100%" }}>
              <Map
                lineId={mapState.lineId}
                linevehicleRefId={mapState.linevehicleRefId}
                timediffer={state.timediffer}
                origiLocations={state.origiLocations}
                destinationLocation={state.destinationLocation}
                isSpeedCallback={mapState.isSpeedCallback}
                isBusStopGet={mapState.isBusStopGet}
              ></Map>
            </Card>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col xs={12}>
            <Card style={{ width: "100%" }}>
              <Button
                onClick={() => {
                  console.log("clicked In dash");
                  mapDispatch({ type: "SELECTBUS", lineId: "19" });
                }}
              >
                Test
              </Button>
            </Card>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs={6}>
            <Card style={{ width: "100%" }}>
              <Card.Title>Bus from AC</Card.Title>
              <BusInfo></BusInfo>
            </Card>
          </Col>
          <Col xs={6}>
            <Card style={{ width: "100%" }}>
              <Card.Title>Speed between stops</Card.Title>
              {state.isTableReady ? (
                <StopInfo
                  timediffer={state.timediffer}
                  origiLocations={state.origiLocations}
                  destinationLocation={state.destinationLocation}
                  busSpeedCallRes={mapState.speedCallRes}
                ></StopInfo>
              ) : (
                <div>Not ready</div>
              )}

              {/* {mapState.readySpeed && (returnTabl())} */}
              {/* {returnTable()} */}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
