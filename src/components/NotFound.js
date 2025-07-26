import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <Container className="text-center my-5">
            <Row>
                <Col>
                    <h1>404</h1>
                    <p>Halaman tidak ditemukan.</p>
                    <Button variant="primary" onClick={() => navigate(-1)}>
                        <i className="bi bi-arrow-left"></i> Kembali ke Halaman Sebelumnya
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default NotFound;