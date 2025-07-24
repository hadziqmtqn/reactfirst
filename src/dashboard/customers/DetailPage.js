import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";

import {
    Container,
    Card,
    Spinner,
    Alert,
    Row,
    Col,
    Button
} from "react-bootstrap";

import { useAppInfo } from "../../context/AppInfoContext";
import { usePageTitle } from "../../components/hooks/usePageTitle";
import { useNavigate } from "react-router-dom";

export default function CustomerDetailPage() {
    const navigate = useNavigate();
    const { organization, customerId } = useParams();
    const { appName } = useAppInfo();
    usePageTitle(`Customer Detail | ${appName}`);

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        setError("");
        axios.get(`/customers/${organization}/${customerId}`)
            .then(res => {
                setCustomer(res.data?.data || null);
                setLoading(false);
            })
            .catch(() => {
                setError("Gagal mengambil data customer.");
                setLoading(false);
            });
    }, [organization, customerId]);

    if (loading) return (
        <Container className="container" style={{ marginTop: '80px' }}>
            <div className="text-center my-5">
                <Spinner animation="border" variant="primary" />
            </div>
        </Container>
    );
    if (error) return (
        <Container className="container" style={{ marginTop: '80px' }}>
            <Alert variant="danger">{error}</Alert>
        </Container>
    );
    if (!customer) return (
        <Container className="container" style={{ marginTop: '80px' }}>
            <Alert variant="warning">Data customer tidak ditemukan.</Alert>
        </Container>
    );

    return (
        <Container className="container" style={{ marginTop: '80px' }}>
            <Card>
                <Card.Header as="h5">
                    <div className="d-flex justify-content-between align-items-center">
                        <span><i className="bi bi-person-circle me-2 text-primary"></i>{customer.contact_name}</span>
                        <Button variant="primary" onClick={() => navigate(-1)}>
                            Kembali
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6}>
                            <p><b>Contact Number:</b> {customer.contact_number}</p>
                            <p><b>Company Name:</b> {customer.company_name}</p>
                            <p><b>First Name:</b> {customer.first_name}</p>
                            <p><b>Last Name:</b> {customer.last_name}</p>
                            <p><b>Department:</b> {customer.department}</p>
                            <p><b>Designation:</b> {customer.designation}</p>
                            <p><b>Tax Info:</b> {customer.contact_tax_information}</p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
}