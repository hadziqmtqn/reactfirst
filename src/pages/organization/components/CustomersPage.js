import React from 'react';
import { Breadcrumb, Card, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const CustomerPage = () => (
    <Container style={{ marginTop: "80px" }}>
        <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/dashboard" }}>Dashboard</Breadcrumb.Item>
            <Breadcrumb.Item active>Setting</Breadcrumb.Item>
        </Breadcrumb>

        <Card className="shadow-sm">
            <Card.Body>
                <Card.Title as="h4" className="mb-4 fw-bold">Organization Settings</Card.Title>
            </Card.Body>
        </Card>
    </Container>
);

export default CustomerPage;