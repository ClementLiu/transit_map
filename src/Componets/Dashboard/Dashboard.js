import React, { useContext } from "react";
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

import { Tabulator } from "Componets/tables";
import Map from "./Map";

function Dashboard() {
  const mapState = useContext(MapContext);
  const mapDispatch = useContext(MapDispatchContext);
  console.log("mapState", mapState);

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
              <Map lineId={mapState.lineId}></Map>
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
          <Col xs={12}>
            <Card style={{ width: "100%" }}>
              <Card.Title>Bus from AC</Card.Title>
              <Tabulator></Tabulator>
            </Card>
          </Col>
        </Row>
        {/* <Row className="mt-3">
          <Col xs={12}>
            <Card style={{ width: "100%" }}>
              <Card.Img variant="top" src="holder.js/100px180" />
              <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row> */}
      </Container>
    </div>
  );
}

export default Dashboard;
