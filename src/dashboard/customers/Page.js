import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import OrganizationSelect from '../../components/organization/OrganizationSelect';
import axios from '../../api/axios';
import Button from "react-bootstrap/Button";

function CustomerTablePage() {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [organizationId, setOrganizationId] = useState('');
    const [organizations, setOrganizations] = useState([]);
    const [customers, setCustomers] = useState([]);
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
            setCustomers(res.data?.data || []);
            setLoading(false);
        })
        .catch(() => {
            setError('Gagal mengambil data customer.');
            setLoading(false);
        });
    }, [debouncedSearch, organizationId]);

    return (
        <Container className="container" style={{ marginTop: '80px' }}>
            <Card>
                <Card.Header as="h5">Customer List</Card.Header>
                <Card.Body>
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
                            <Form.Control
                                type="text"
                                placeholder="Cari customer..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                disabled={loading}
                            />
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
                                        <td colSpan={5} className="text-center">
                                            <Spinner animation="border" variant="primary" />
                                        </td>
                                    </tr>
                                ) : customers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center">Tidak ada data customer.</td>
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
                                                <Button variant="link">Edit</Button>
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