import React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { usePageTitle } from "../components/hooks/usePageTitle";
import { useAppInfo } from "../context/AppInfoContext";
import {
    Button,
    Col,
    Row
} from "react-bootstrap";

import OrganizationList
    from "../components/organization/GetOrganizations";

function LandingPage() {
    const { appName } = useAppInfo();
    usePageTitle(`Landing Page | ${appName}`);

    return (
        <Container style={{marginTop: '80px'}}>
            <Card className="mb-4">
                <Card.Body className="text-center">
                    <h1>Welcome to My App</h1>
                    <p>This is the landing page. Use the menu to navigate.</p>
                </Card.Body>
            </Card>
            {/*<Row>
                <Col md={4}>
                    <Card bg="primary" text="white">
                        <Card.Body>
                            <Card.Title> Card Title </Card.Title>
                            <Card.Text>
                                Some quick example text to build on the card title and make up the
                                bulk of the card's content.
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <Button as="a" variant="warning">Buka</Button>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>*/}
            <OrganizationList />
        </Container>
    );
}

export default LandingPage;