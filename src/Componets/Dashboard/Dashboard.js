import React, { useState } from "react";
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

import { Tabulator } from "Componets/tables";
import Map from "./Map";

function Dashboard() {
  const [bustState, setbusState] = useState(-1);
  const handleClick = () => {
    console.log("clicked In dash");
    setbusState(19);
    console.log("bustState", bustState);
  };
  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Looking Bus</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container fluid="md" className="mt-5">
        <Row>
          <Col xs={12}>
            <Card style={{ width: "100%" }}>
              <Map vehicleRef={bustState}></Map>
            </Card>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col xs={12}>
            <Card style={{ width: "100%" }}>
              <Button onClick={handleClick}>Test</Button>
            </Card>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col xs={12}>
            <Card style={{ width: "100%" }}>
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
