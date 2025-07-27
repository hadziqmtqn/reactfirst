import React, { useEffect, useState } from 'react';
import { usePageTitle } from "../../../hooks/usePageTitle";
import { useAppInfo } from "../../../context/AppInfoContext";
import {
    Breadcrumb,
    Card,
    Container,
    Row,
    Col,
    FormFloating,
    Form,
    Spinner,
    Badge,
    Button,
    Table
} from "react-bootstrap";
import { Link , useParams } from "react-router-dom";
import Sidebar from "../page-components/Sidebar";
import { organizationSidebarItems } from '../page-components/SidebarConfig';
import axios from "../../../api/axios";
import Header from "../page-components/Header";
import { toast } from "react-toastify";

const CustomersPage = () => {
    const { appName } = useAppInfo();
    usePageTitle(`Customers | ${appName}`);

    const { organizationSlug } = useParams();
    const sidebarItems = organizationSidebarItems(organizationSlug);

    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [customerData, setCustomerData] = useState({
        organizationSlug: "",
        organizationName: "",
        organizationId: "",
        customers: []
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/customers/${organizationSlug}`, {
                params: { search: debouncedSearch }
            });
            if (res.data.success && res.data.data) {
                setCustomerData({
                    organizationSlug: organizationSlug,
                    organizationName: res.data.data.organizationName || '',
                    organizationId: res.data.data.organizationId || '',
                    customers: res.data.data.customers.data || []
                });
            } else {
                toast.error('Gagal mengambil data customer. Silakan coba lagi.');
                setCustomerData({
                    organizationSlug: organizationSlug,
                    organizationName: '',
                    organizationId: '',
                    customers: []
                });
            }
        } catch (err) {
            toast.error('Gagal mengambil data customer. Silakan coba lagi.');
            setCustomerData({
                organizationSlug: organizationSlug,
                organizationName: '',
                organizationId: '',
                customers: []
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCustomers();
        // eslint-disable-next-line
    }, [debouncedSearch, organizationSlug]);

    return (
        <Container style={{ marginTop: "80px" }}>
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/dashboard" }}>
                    Dashboard
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Customers</Breadcrumb.Item>
            </Breadcrumb>
            <Row>
                <Col xs={12} md={3} className="mb-4">
                    <Sidebar items={sidebarItems} />
                </Col>
                <Col xs={12} md={9}>
                    <Header name={customerData.organizationName} orgId={customerData.organizationId} />
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title as="h4" className="mb-4 fw-bold">
                                Customers
                            </Card.Title>
                            <Row className="mb-3">
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
                            <div className="table-responsive">
                                <Table striped bordered hover responsive="md" className="text-nowrap">
                                    <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Customer Name</th>
                                        <th>Contact Number</th>
                                        <th>Company Name</th>
                                        <th>Status</th>
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
                                    ) : customerData.customers.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center">Tidak ada data customer.</td>
                                        </tr>
                                    ) : (
                                        customerData.customers.map((c, i) => (
                                            <tr key={c.contact_id}>
                                                <td>{i + 1}</td>
                                                <td>{c.customer_name}</td>
                                                <td>{c.contact_number}</td>
                                                <td>{c.company_name}</td>
                                                <td>
                                                    <Badge bg={
                                                        c.status === 'active' ? 'success' :
                                                            c.status === 'inactive' ? 'danger' :
                                                                c.status === 'pending' ? 'warning text-dark' :
                                                                    'light text-dark'
                                                    }>
                                                        <span className="text-uppercase">{c.status}</span>
                                                    </Badge>
                                                </td>
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
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CustomersPage;