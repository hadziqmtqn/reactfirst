import React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
//import { usePageTitle } from "../components/hooks/usePageTitle";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useAppInfo } from "../../context/AppInfoContext";

import OrganizationList
    from "../../components/organization/GetOrganizations";
import {
    Button
} from "react-bootstrap";

function DashboardPage() {
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

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Organization List</h4>
                <Button variant="success">
                    <i className="bi bi-plus-circle me-2"></i>Add Organization
                </Button>
            </div>
            <OrganizationList />
        </Container>
    );
}

export default DashboardPage;