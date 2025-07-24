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
} from "react-bootstrap";

import { useAppInfo } from "../../context/AppInfoContext";
import { usePageTitle } from "../../components/hooks/usePageTitle";

export default function CustomerDetailPage() {
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
            <Row>
                <Col xl={4} lg={5} sm={12} className="mb-4">
                    <Card className="shadow-none">
                        <Card.Body>
                            <Card.Title as="h5" className="mb-3 fw-bold text-center">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(customer.contact_name)}&background=EBF4FF&color=7F9CF5&size=96`}
                                    alt={customer.contact_name}
                                    className="rounded-circle mb-3"
                                    width={96}
                                    height={96}
                                />
                                <Card.Title as="h5" className="mb-3 fw-bold">
                                    {customer.contact_name}
                                </Card.Title>
                            </Card.Title>
                            <dl>
                                <dd className="mb-0 small">Contact ID:</dd>
                                <dt className="mb-2">{customer.contact_id || '-'}</dt>
                                <dd className="mb-0 small">Contact Number:</dd>
                                <dt className="mb-2">{customer.contact_number || '-'}</dt>
                                <dd className="mb-0 small">Company Name:</dd>
                                <dt className="mb-2">{customer.company_name || '-'}</dt>
                                <dd className="mb-0 small">Email:</dd>
                                <dt className="mb-2">{customer.email || '-'}</dt>
                                <dd className="mb-0 small">Mobile:</dd>
                                <dt className="mb-2">{customer.mobile || '-'}</dt>
                                <dd className="mb-0 small">Website:</dd>
                                <dt className="mb-2">{customer.website || '-'}</dt>
                            </dl>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={8} lg={7} sm={12}>
                    <Card className="shadow-none">
                        <Card.Body>
                            <Card.Title as="h5" className="mb-3 fw-bold">Update Customer</Card.Title>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}