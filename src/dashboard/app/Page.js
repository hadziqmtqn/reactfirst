import React from "react";
import Container from 'react-bootstrap/Container';
import {
    Card
} from 'react-bootstrap';
import { useAppInfo } from "../../context/AppInfoContext";

function Page() {
    const { appName, appLogo } = useAppInfo();

    return (
        <Container style={{marginTop: '80px'}}>
            <Card>
                <Card.Body className="text-center">
                    {appLogo && (
                        <img src={appLogo} alt={appName} width="60" style={{ marginBottom: 16 }} />
                    )}
                    <h2>{appName}</h2>
                    <p>Welcome to the {appName} app page!</p>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Page;