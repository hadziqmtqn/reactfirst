import React, { useEffect, useState } from "react";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useAppInfo } from "../../context/AppInfoContext";
import {
    Breadcrumb,
    Card,
    Container,
    Row,
    Col,
    Form,
    Button,
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { organizationSidebarItems } from "../components/SidebarConfig";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import Header from "../components/Header";
import ItemList from "../../components/items/ItemList";
import ItemModal from "../../components/items/ItemModal";
import Swal
    from "sweetalert2";

const TABLE_COLUMNS = [
    { key: "no", label: "No", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "product_type", label: "Product Type", sortable: false },
    { key: "rate", label: "Rate", sortable: true },
    { key: "status", label: "Status", sortable: false },
    { key: "action", label: "Action", sortable: false },
];
const FILTER_BY_OPTIONS = [
    { value: "Status.All", label: "All" },
    { value: "Status.Active", label: "Active" },
    { value: "Status.Inactive", label: "Inactive" },
];

const defaultFormData = { name: "", rate: "", description: "" };

const ItemsPage = () => {
    const { appName } = useAppInfo();
    usePageTitle(`Items | ${appName}`);
    const { organizationSlug } = useParams();
    const sidebarItems = organizationSidebarItems(organizationSlug);

    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [filterBy, setFilterBy] = useState("Status.All");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [itemData, setItemData] = useState({
        organizationSlug: "",
        organizationName: "",
        organizationId: "",
        items: [],
    });

    const [sortColumn, setSortColumn] = useState("name");
    const [sortOrder, setSortOrder] = useState("A"); // "A" = Ascending, "D" = Descending

    // Modal & form state
    const [modalShow, setModalShow] = useState(false);
    const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
    const [formData, setFormData] = useState(defaultFormData);
    const [formError, setFormError] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Default empty items data
    const emptyItemData = {
        organizationSlug,
        organizationName: "",
        organizationId: "",
        items: [],
    };

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
                },
            });
            if (res.data.success && res.data.data) {
                setItemData({
                    organizationSlug,
                    organizationName: res.data.data.organizationName || "",
                    organizationId: res.data.data.organizationId || "",
                    items: res.data.data.items || [],
                });
            } else {
                toast.error("Gagal mengambil data item. Silakan coba lagi.");
                setItemData(emptyItemData);
            }
        } catch (err) {
            toast.error("Gagal mengambil data item. Silakan coba lagi.");
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

    // Modal handlers
    const openCreateModal = () => {
        setModalMode("create");
        setFormData(defaultFormData);
        setFormError({});
        setEditingId(null);
        setModalShow(true);
    };

    const openEditModal = (item) => {
        setModalMode("edit");
        setFormData({
            product_type: item.product_type || "",
            name: item.name || "",
            rate: item.rate || "",
            description: item.description || "",
        });
        setFormError({});
        setEditingId(item.item_id);
        setModalShow(true);
    };

    const handleModalChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setFormError({});
        try {
            if (modalMode === "create") {
                await axios.post(`/items/${organizationSlug}/store`, formData);
                toast.success("Item created!");
            } else if (modalMode === "edit" && editingId) {
                await axios.put(`/items/${organizationSlug}/${editingId}/update`, formData);
                toast.success("Item updated!");
            }
            setModalShow(false);
            fetchItems();
        } catch (err) {
            setFormError(err.response?.data?.errors || {});
        }
        setSubmitLoading(false);
    };

    const handleDelete = async (item) => {
        const result = await Swal.fire({
            title: "Konfirmasi Hapus",
            text: `Yakin ingin menghapus item "${item.name}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
            reverseButtons: true,
            confirmButtonColor: "#d33",
        });

        if (!result.isConfirmed) return;
        setLoading(true);
        try {
            await axios.delete(`/items/${organizationSlug}/${item.item_id}/delete`);
            toast.success("Item deleted!");
        } catch (err) {
            toast.error("Gagal menghapus item.");
        }
        setLoading(false);
        fetchItems();
    };

    return (
        <Container style={{ marginTop: "80px" }}>
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/dashboard" }}>
                    Dashboard
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Items</Breadcrumb.Item>
            </Breadcrumb>

            <Row>
                {/* Sidebar kiri */}
                <Col xs={12} md={3} className="mb-4">
                    <Sidebar items={sidebarItems} />
                </Col>

                {/* Konten utama kanan */}
                <Col xs={12} md={9}>
                    <Header
                        name={itemData.organizationName}
                        orgId={itemData.organizationId}
                    />
                    <Card className="shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <Card.Title as="h4" className="fw-bold m-0">
                                    Items
                                </Card.Title>
                                <Button variant="primary" onClick={openCreateModal}>
                                    + Create Item
                                </Button>
                            </div>
                            <Row>
                                <Col md={6}>
                                    <Form className="mb-2">
                                        <Form.Control
                                            type="search"
                                            placeholder="Cari item..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            disabled={loading}
                                        />
                                    </Form>
                                </Col>
                                <Col md={6}>
                                    <Form.Select
                                        value={filterBy}
                                        onChange={(e) => setFilterBy(e.target.value)}
                                        disabled={loading}
                                    >
                                        {FILTER_BY_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            </Row>
                            <ItemList
                                loading={loading}
                                items={itemData.items}
                                TABLE_COLUMNS={TABLE_COLUMNS}
                                sortColumn={sortColumn}
                                sortOrder={sortOrder}
                                handleSort={handleSort}
                                onEdit={openEditModal}
                                onDelete={handleDelete}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <ItemModal
                show={modalShow}
                mode={modalMode}
                formData={formData}
                formError={formError}
                loading={submitLoading}
                onClose={() => setModalShow(false)}
                onChange={handleModalChange}
                onSubmit={handleModalSubmit}
            />
        </Container>
    );
};

export default ItemsPage;