import React, {
    useEffect,
    useState
} from 'react';
import { usePageTitle } from "../../hooks/usePageTitle";
import { useAppInfo } from "../../context/AppInfoContext";
import {
    Breadcrumb,
    Card,
    Container,
    Row,
    Col,
    Form,
    Spinner,
    Badge
} from "react-bootstrap";
import { Link , useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { organizationSidebarItems } from '../components/SidebarConfig';
import axios
    from "../../api/axios";
import {
    toast
} from "react-toastify";
import Header
    from "../components/Header";

const TABLE_COLUMNS = [
    { key: "no", label: "No", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "product_type", label: "Product Type", sortable: false },
    { key: "rate", label: "Rate", sortable: true },
    { key: "status", label: "Status", sortable: false },
    { key: "action", label: "Action", sortable: false }
];
const FILTER_BY_OPTIONS = [
    { value: "Status.All", label: "All" },
    { value: "Status.Active", label: "Active" },
    { value: "Status.Inactive", label: "Inactive" }
];

const ItemsPage = () => {
    const { appName } = useAppInfo();
    usePageTitle(`Items | ${appName}`);

    const { organizationSlug } = useParams();
    const sidebarItems = organizationSidebarItems(organizationSlug);

    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [filterBy, setFilterBy] = useState('Status.All');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [itemData, setItemData] = useState({
        organizationSlug: "",
        organizationName: "",
        organizationId: "",
        items: [],
    });

    const [sortColumn, setSortColumn] = useState("name");
    const [sortOrder, setSortOrder] = useState("A"); // "A" = Ascending, "D" = Descending

    // Default empty items data
    const emptyItemData = {
        organizationSlug: organizationSlug,
        organizationName: '',
        organizationId: '',
        items: [],
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/items/${organizationSlug}`, {
                params: {
                    search: debouncedSearch,
                    filter_by: filterBy,
                    sort_column: sortColumn,
                    sort_order: sortOrder,
                }
            });
            if (res.data.success && res.data.data) {
                setItemData({
                    organizationSlug: organizationSlug,
                    organizationName: res.data.data.organizationName || '',
                    organizationId: res.data.data.organizationId || '',
                    items: res.data.data.items || [],
                });
            } else {
                toast.error('Gagal mengambil data customer. Silakan coba lagi.');
                setItemData(emptyItemData);
            }
        } catch (err) {
            toast.error('Gagal mengambil data customer. Silakan coba lagi.');
            setItemData(emptyItemData);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch, filterBy, organizationSlug, sortColumn, sortOrder]);

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

    return (
        <Container style={{ marginTop: "80px" }}>
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/dashboard" }}>Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Items</Breadcrumb.Item>
            </Breadcrumb>

            <Row>
                {/* Sidebar kiri */}
                <Col xs={12} md={3} className="mb-4">
                    <Sidebar items={sidebarItems} />
                </Col>

                {/* Konten utama kanan */}
                <Col xs={12} md={9}>
                    <Header name={itemData.organizationName} orgId={itemData.organizationId} />
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title as="h4" className="mb-4 fw-bold">
                                Items
                            </Card.Title>
                            {/* Konten utama di sini */}
                            <Row>
                                <Col md={6}>
                                    <Form className="mb-2">
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
                                    <Form.Select
                                        value={filterBy}
                                        onChange={e => setFilterBy(e.target.value)}
                                        disabled={loading}
                                    >
                                        {FILTER_BY_OPTIONS.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            </Row>
                            <div className="table-responsive">
                                <table className="table table-striped table-hover mt-3">
                                    <thead>
                                        <tr>
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={TABLE_COLUMNS.length} className="text-center">
                                                <Spinner animation="border" variant="primary" />
                                            </td>
                                        </tr>
                                    ) : itemData.items.length > 0 ? (
                                        itemData.items.map((item, index) => (
                                            <tr key={item.item_id}>
                                                <td>{index + 1}</td>
                                                <td>{item.name || item.item_name}</td>
                                                <td>{item.product_type}</td>
                                                <td>{item.rate}</td>
                                                <td>
                                                    <Badge bg={item.status === 'active' ? 'success' : 'secondary'}>
                                                        <span className="text-capitalize">
                                                            {item.status}
                                                        </span>
                                                    </Badge>
                                                </td>
                                                <td>
                                                    {/*button delete & button update modal*/}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={TABLE_COLUMNS.length} className="text-center">
                                                No items found.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ItemsPage;