import React, { useEffect, useState } from 'react';
import { usePageTitle } from "../../../hooks/usePageTitle";
import { useAppInfo } from "../../../context/AppInfoContext";
import {
    Breadcrumb,
    Card,
    Container,
    Row,
    Col,
    Form,
    Spinner,
    Badge,
    Button,
    Table,
    Pagination
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../page-components/Sidebar";
import { organizationSidebarItems } from '../page-components/SidebarConfig';
import axios from "../../../api/axios";
import Header from "../page-components/Header";
import { toast } from "react-toastify";

const PER_PAGE_OPTIONS = [2, 10, 20, 50, 100];
const TABLE_COLUMNS = [
    { key: "customer_name", label: "Customer Name", sortable: true },
    { key: "contact_number", label: "Contact Number", sortable: false },
    { key: "company_name", label: "Company Name", sortable: true },
    { key: "status", label: "Status", sortable: false }
];

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
        customers: [],
        meta: {
            page: 1,
            per_page: 10,
            has_more_page: false,
            total: 0,
            sort_column: "customer_name",
            sort_order: "A"
        }
    });
    const [loading, setLoading] = useState(false);

    // Pagination & sort states
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [sortColumn, setSortColumn] = useState("customer_name");
    const [sortOrder, setSortOrder] = useState("A"); // "A" = Ascending, "D" = Descending

    // Debounce input search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    // Reset page to 1 when search, perPage, or sort changes
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, perPage, sortColumn, sortOrder, organizationSlug]);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/customers/${organizationSlug}`, {
                params: {
                    search: debouncedSearch,
                    page,
                    per_page: perPage,
                    sort_column: sortColumn,
                    sort_order: sortOrder
                }
            });
            if (res.data.success && res.data.data) {
                setCustomerData({
                    organizationSlug: organizationSlug,
                    organizationName: res.data.data.organizationName || '',
                    organizationId: res.data.data.organizationId || '',
                    customers: res.data.data.customers.data || [],
                    meta: res.data.data.customers.meta || {
                        page: page,
                        per_page: perPage,
                        has_more_page: false,
                        total: 0,
                        sort_column: sortColumn,
                        sort_order: sortOrder
                    }
                });
            } else {
                toast.error('Gagal mengambil data customer. Silakan coba lagi.');
                setCustomerData({
                    organizationSlug: organizationSlug,
                    organizationName: '',
                    organizationId: '',
                    customers: [],
                    meta: {
                        page: page,
                        per_page: perPage,
                        has_more_page: false,
                        total: 0,
                        sort_column: sortColumn,
                        sort_order: sortOrder
                    }
                });
            }
        } catch (err) {
            toast.error('Gagal mengambil data customer. Silakan coba lagi.');
            setCustomerData({
                organizationSlug: organizationSlug,
                organizationName: '',
                organizationId: '',
                customers: [],
                meta: {
                    page: page,
                    per_page: perPage,
                    has_more_page: false,
                    total: 0,
                    sort_column: sortColumn,
                    sort_order: sortOrder
                }
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCustomers();
        // eslint-disable-next-line
    }, [debouncedSearch, organizationSlug, page, perPage, sortColumn, sortOrder]);

    // Pagination controls
    const handlePrevPage = () => {
        if (page > 1) setPage(page - 1);
    };
    const handleNextPage = () => {
        if (customerData.meta.has_more_page) setPage(page + 1);
    };

    // Sort controls
    const handleSort = (columnKey, sortable) => {
        if (!sortable) return;
        if (sortColumn === columnKey) {
            setSortOrder(sortOrder === "A" ? "D" : "A");
        } else {
            setSortColumn(columnKey);
            setSortOrder("A");
        }
    };

    // Calculate total pages if available (optional)
    const totalPages = customerData.meta.total && customerData.meta.per_page
        ? Math.ceil(customerData.meta.total / customerData.meta.per_page)
        : page + (customerData.meta.has_more_page ? 1 : 0);

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
                                    <Form>
                                        <Form.Control
                                            type="search"
                                            placeholder="Cari customer..."
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            disabled={loading}
                                        />
                                    </Form>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="d-flex align-items-center justify-content-end">
                                        <Form.Label className="me-2 mb-0">Show per page:</Form.Label>
                                        <Form.Select
                                            value={perPage}
                                            onChange={e => setPerPage(Number(e.target.value))}
                                            style={{ width: "80px" }}
                                            disabled={loading}
                                        >
                                            {PER_PAGE_OPTIONS.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <div className="table-responsive">
                                <Table striped bordered hover responsive="md" className="text-nowrap">
                                    <thead>
                                    <tr>
                                        <th>No</th>
                                        {TABLE_COLUMNS.map(col => (
                                            <th
                                                key={col.key}
                                                style={col.sortable ? { cursor: "pointer" } : {}}
                                                onClick={() => handleSort(col.key, col.sortable)}
                                            >
                                                {col.label}
                                                {col.sortable && sortColumn === col.key && (
                                                    <span>
                                                        {" "}
                                                        {sortOrder === "A" ? "▲" : "▼"}
                                                    </span>
                                                )}
                                            </th>
                                        ))}
                                        <th>Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={TABLE_COLUMNS.length + 2} className="text-center">
                                                <Spinner animation="border" variant="primary" />
                                            </td>
                                        </tr>
                                    ) : customerData.customers.length === 0 ? (
                                        <tr>
                                            <td colSpan={TABLE_COLUMNS.length + 2} className="text-center">Tidak ada data customer.</td>
                                        </tr>
                                    ) : (
                                        customerData.customers.map((c, i) => (
                                            <tr key={c.contact_id}>
                                                <td>{(page - 1) * perPage + i + 1}</td>
                                                <td>{c.customer_name || c.contact_name}</td>
                                                <td>{c.contact_number || "-"}</td>
                                                <td>{c.company_name || c.vendor_name || "-"}</td>
                                                <td>
                                                    <Badge bg={
                                                        c.status === 'active' ? 'success' :
                                                            c.status === 'inactive' ? 'danger' :
                                                                c.status === 'pending' ? 'warning text-dark' :
                                                                    'light text-dark'
                                                    }>
                                                        <span className="text-uppercase">{c.status || '-'}</span>
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

                            {/* Pagination Controls */}
                            <div className="d-flex justify-content-between align-items-center mt-3">
                                <span>
                                    Page {customerData.meta.page}
                                    {totalPages > 1 ? ` of ${totalPages}` : ""}
                                </span>
                                <Pagination>
                                    <Pagination.Prev onClick={handlePrevPage} disabled={page <= 1 || loading} />
                                    <Pagination.Item active>{page}</Pagination.Item>
                                    <Pagination.Next onClick={handleNextPage} disabled={!customerData.meta.has_more_page || loading} />
                                </Pagination>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CustomersPage;