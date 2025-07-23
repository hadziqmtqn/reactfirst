import React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

function LandingPage() {
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