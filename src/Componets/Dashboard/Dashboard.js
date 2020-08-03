import React, { useContext, useState } from "react";
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
  });
  const returnTabl = () => {
    const { timediffer, origiLocations, destinationLocation } = importBusSpeed(
      mapState.lineId
    );
    setState({ timediffer, origiLocations, destinationLocation });
    return (
      <StopInfo
        timediffer={state.timediffer}
        origiLocations={state.origiLocations}
        destinationLocation={state.destinationLocation}
        busSpeedCallRes={mapState.speedCallRes}
      ></StopInfo>
    );
  };
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
              {mapState.readySpeed && returnTabl()}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
