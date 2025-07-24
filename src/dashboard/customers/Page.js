import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { Link } from "react-router-dom";

import {
    Card,
    Row,
    Col,
    Table,
    Container,
    Spinner,
    Alert,
    Form,
    Button,
    FormFloating
} from 'react-bootstrap';

import OrganizationSelect from '../../components/organization/OrganizationSelect';
import { useAppInfo } from "../../context/AppInfoContext";
import { usePageTitle } from "../../components/hooks/usePageTitle";

function CustomerTablePage() {
    const { appName } = useAppInfo();
    usePageTitle(`Customers | ${appName}`);

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [organizationId, setOrganizationId] = useState('');
    const [organizations, setOrganizations] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [organizationSlug, setOrganizationSlug] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Ambil data organization saat komponen mount
    useEffect(() => {
        axios.get('/select-organization').then(res => {
            const data = res.data?.data || [];
            setOrganizations(data);
            if (data.length > 0) {
                setOrganizationId(data[0].id.toString());
            }
        });
    }, []);

    // Debounce input search (delay request sampai user berhenti ngetik 500ms)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    // Fetch customers data when organizationId or search changes
    useEffect(() => {
        if (!organizationId) {
            setCustomers([]);
            setOrganizationSlug([]);
            return;
        }
        setLoading(true);
        setError('');
        axios.get('/customers', {
            params: {
                search: debouncedSearch,
                organization_id: organizationId
            }
        })
        .then(res => {
            const data = res.data?.data || {};
            setCustomers(data.custumers || []);
            setOrganizationSlug(data.organizationSlug || '');
            setLoading(false);
        })
        .catch(() => {
            setError('Gagal mengambil data customer.');
            setLoading(false);
        });
    }, [debouncedSearch, organizationId]);

    return (
        <Container className="container" style={{ marginTop: '80px' }}>
            <Card className="shadow-sm">
                <Card.Body>
                    <Card.Title as="h4" className="mb-4 fw-bold">Customer List</Card.Title>
                    <Row className="mb-3">
                        <Col md={6}>
                            <OrganizationSelect
                                value={organizationId}
                                onChange={e => setOrganizationId(e.target.value)}
                                options={organizations}
                                required
                            />
                        </Col>
                        <Col md={6}>
                            <FormFloating>
                                <Form.Control
                                    type="search"
                                    placeholder="Cari customer..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    disabled={loading}
                                />
                                <Form.Label column="">Search Customer</Form.Label>
                            </FormFloating>
                        </Col>
                    </Row>
                    {!organizationId && (
                        <Alert variant="warning">
                            Silakan pilih organisasi terlebih dahulu!
                        </Alert>
                    )}
                    {error && <Alert variant="danger">{error}</Alert>}
                    {organizationId && (
                        <Table striped bordered hover responsive="md">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Customer Name</th>
                                    <th>Contact Number</th>
                                    <th>Company Name</th>
                                    <th>Website</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center">
                                            <Spinner animation="border" variant="primary" />
                                        </td>
                                    </tr>
                                ) : customers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center">Tidak ada data customer.</td>
                                    </tr>
                                ) : (
                                    customers.map((c, i) => (
                                        <tr key={c.contact_id}>
                                            <td>{i + 1}</td>
                                            <td>{c.customer_name}</td>
                                            <td>{c.contact_number}</td>
                                            <td>{c.company_name}</td>
                                            <td>{c.website}</td>
                                            <td>
                                                <Button
                                                    as={Link}
                                                    to={`/customers/${organizationSlug}/${c.contact_id}`}
                                                    variant="primary"
                                                >
                                                    <i className="bi bi-eye"></i> Detail
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default CustomerTablePage;