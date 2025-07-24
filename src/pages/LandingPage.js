import React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { usePageTitle } from "../components/hooks/usePageTitle";
import { useAppInfo } from "../context/AppInfoContext";

function LandingPage() {
    const { appName } = useAppInfo();
    usePageTitle(`Landing Page | ${appName}`);

    return (
        <Container style={{marginTop: '80px'}}>
            <Card>
                <Card.Body className="text-center">
                    <h1>Welcome to My App</h1>
                    <p>This is the landing page. Use the menu to navigate.</p>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default LandingPage;