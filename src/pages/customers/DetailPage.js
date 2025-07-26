import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../api/axios";
import {
    Container,
    Card,
    Alert,
    Row,
    Col,
    Form,
    Button,
    FormFloating,
    Breadcrumb
} from "react-bootstrap";
import { useAppInfo } from "../../context/AppInfoContext";
import { usePageTitle } from "../../hooks/usePageTitle";
import ToastAlert from "../../components/ToastAlert";

export default function CustomerDetailPage() {
    const { organization, customerId } = useParams();
    const { appName } = useAppInfo();
    usePageTitle(`Customer Detail | ${appName}`);

    const [customer, setCustomer] = useState(null); // untuk display kiri
    const [formCustomer, setFormCustomer] = useState({
        contact_name: "",
        contact_id: "",
        contact_number: "",
        company_name: "",
        email: "",
        mobile: "",
        website: "",
        notes: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);

    // Toast state
    const [toastShow, setToastShow] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("primary");

    const showToast = (message, variant = "primary") => {
        setToastMessage(message);
        setToastVariant(variant);
        setToastShow(true);
    };

    // Fetch customer data, with optional loading spinner
    const fetchCustomer = async (withLoading = true) => {
        if (withLoading) setLoading(true);
        setErrors({});
        try {
            const res = await axios.get(`/customers/${organization}/${customerId}`);
            if (res.data?.data) {
                setCustomer(res.data.data);
                setFormCustomer(res.data.data); // sinkronkan form dengan data asli
            } else {
                setCustomer(null);
                setFormCustomer({
                    contact_name: "",
                    contact_id: "",
                    contact_number: "",
                    company_name: "",
                    email: "",
                    mobile: "",
                    website: "",
                    notes: ""
                });
            }
        } catch (err) {
            setCustomer(null);
            setFormCustomer({
                contact_name: "",
                contact_id: "",
                contact_number: "",
                company_name: "",
                email: "",
                mobile: "",
                website: "",
                notes: ""
            });
            showToast(
                err.response?.data?.message || "Terjadi kesalahan, silakan coba lagi.",
                "danger"
            );
        }
        if (withLoading) setLoading(false);
    };

    useEffect(() => {
        fetchCustomer(true)
            .then(() => {
                //
            }); // page pertama kali load, tampilkan spinner
        // eslint-disable-next-line
    }, [organization, customerId]);

    // Handle input change & clear error for field
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormCustomer({
            ...formCustomer,
            [name]: value
        });

        // Hapus error pada field yang diubah
        if (errors[name]) {
            setErrors({ ...errors, [name]: undefined });
        }
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setErrors({});
        try {
            const res = await axios.put(`/customers/${organization}/${customerId}`, {
                contact_name: formCustomer.contact_name,
                company_name: formCustomer.company_name,
                website: formCustomer.website,
                notes: formCustomer.notes
            });
            if (res.data.success) {
                showToast("Data customer berhasil diupdate.", "primary");
                setCustomer(res.data.data); // update data untuk display
                setFormCustomer(res.data.data); // update data untuk form
                // Ambil ulang tanpa spinner
                await fetchCustomer(false);
            } else {
                showToast(typeof res.data.message === "string" ? res.data.message : "Terjadi kesalahan.", "danger");
            }
        } catch (err) {
            // Tangani error 422 dari backend
            if (err.response && err.response.status === 422 && err.response.data.message) {
                setErrors(err.response.data.message || {});
            } else {
                showToast(err.response?.data?.message || "Terjadi kesalahan, silakan coba lagi.", "danger");
            }
        }
        setFormLoading(false);
    };

    // Cancel: reset formCustomer ke customer
    const handleCancel = () => {
        if (customer) {
            setFormCustomer(customer);
            setErrors({});
        }
    };

    // Render Toast di luar spinner/loading branch
    return (
        <>
            <ToastAlert
                show={toastShow}
                onClose={() => setToastShow(false)}
                message={toastMessage}
                variant={toastVariant}
            />
            {loading ? (
                <Container className="container" style={{ marginTop: '80px' }}>
                    <div className="text-center my-5">
                        {/* Spinner hanya muncul pada first load */}
                        <span className="spinner-border text-primary" />
                    </div>
                </Container>
            ) : !customer ? (
                <Container className="container" style={{ marginTop: '80px' }}>
                    <Alert variant="warning">Data customer tidak ditemukan.</Alert>
                </Container>
            ) : (
                <Container className="container" style={{ marginTop: '80px' }}>

                    <Breadcrumb>
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Home</Breadcrumb.Item>
                        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/customers" }}>Customers</Breadcrumb.Item>
                        <Breadcrumb.Item active>Detail</Breadcrumb.Item>
                    </Breadcrumb>

                    <Row>
                        <Col xl={4} lg={5} sm={12} className="mb-4">
                            <Card className="shadow-none">
                                <Card.Body>
                                    <Card.Title className="mb-3 fw-bold text-center">
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
                                        <dd className="mb-0 small">Notes:</dd>
                                        <dt className="mb-2">{customer.notes || '-'}</dt>
                                    </dl>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col xl={8} lg={7} sm={12}>
                            <Card className="shadow-none">
                                <Card.Body>
                                    <Card.Title as="h5" className="mb-3 fw-bold">Update Customer</Card.Title>
                                    <Form onSubmit={handleSubmit} noValidate>
                                        <FormFloating className="mb-3">
                                            <Form.Control
                                                type="text"
                                                name="contact_name"
                                                value={formCustomer.contact_name}
                                                onChange={handleChange}
                                                isInvalid={!!errors.contact_name}
                                                placeholder="Contact Name"
                                                required
                                            />
                                            <Form.Label htmlFor="contact_name" column="">Contact Name</Form.Label>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.contact_name && errors.contact_name[0]}
                                            </Form.Control.Feedback>
                                        </FormFloating>
                                        <FormFloating className="mb-3">
                                            <Form.Control
                                                type="text"
                                                name="contact_id"
                                                value={formCustomer.contact_id}
                                                onChange={handleChange}
                                                isInvalid={!!errors.contact_id}
                                                placeholder="Contact ID"
                                                disabled={true}
                                            />
                                            <Form.Label column="" htmlFor="contact_id">Contact ID</Form.Label>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.contact_id && errors.contact_id[0]}
                                            </Form.Control.Feedback>
                                        </FormFloating>
                                        <FormFloating className="mb-3">
                                            <Form.Control
                                                type="text"
                                                name="contact_number"
                                                value={formCustomer.contact_number}
                                                onChange={handleChange}
                                                isInvalid={!!errors.contact_number}
                                                placeholder="Contact Number"
                                                disabled={true}
                                            />
                                            <Form.Label column="" htmlFor="contact_number">Contact Number</Form.Label>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.contact_number && errors.contact_number[0]}
                                            </Form.Control.Feedback>
                                        </FormFloating>
                                        <FormFloating className="mb-3">
                                            <Form.Control
                                                type="text"
                                                name="company_name"
                                                value={formCustomer.company_name}
                                                onChange={handleChange}
                                                isInvalid={!!errors.company_name}
                                                placeholder="Company Name"
                                                required
                                            />
                                            <Form.Label column="" htmlFor="company_name">Company Name</Form.Label>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.company_name && errors.company_name[0]}
                                            </Form.Control.Feedback>
                                        </FormFloating>
                                        <FormFloating className="mb-3">
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formCustomer.email}
                                                onChange={handleChange}
                                                isInvalid={!!errors.email}
                                                placeholder="Email"
                                                disabled={true}
                                            />
                                            <Form.Label column="" htmlFor="email">Email</Form.Label>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.email && errors.email[0]}
                                            </Form.Control.Feedback>
                                        </FormFloating>
                                        <FormFloating className="mb-3">
                                            <Form.Control
                                                type="text"
                                                name="mobile"
                                                value={formCustomer.mobile}
                                                onChange={handleChange}
                                                isInvalid={!!errors.mobile}
                                                placeholder="Mobile"
                                                disabled={true}
                                            />
                                            <Form.Label column="" htmlFor="mobile">Mobile</Form.Label>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.mobile && errors.mobile[0]}
                                            </Form.Control.Feedback>
                                        </FormFloating>
                                        <FormFloating className="mb-3">
                                            <Form.Control
                                                type="text"
                                                name="website"
                                                value={formCustomer.website}
                                                onChange={handleChange}
                                                isInvalid={!!errors.website}
                                                placeholder="Website"
                                            />
                                            <Form.Label column="" htmlFor="website">Website</Form.Label>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.website && errors.website[0]}
                                            </Form.Control.Feedback>
                                        </FormFloating>
                                        <FormFloating className="mb-3">
                                            <Form.Control
                                                as="textarea"
                                                name="notes"
                                                value={formCustomer.notes}
                                                onChange={handleChange}
                                                isInvalid={!!errors.notes}
                                                placeholder="Notes"
                                                style={{ minHeight: "100px" }}
                                            />
                                            <Form.Label column="" htmlFor="notes">Notes</Form.Label>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.notes && errors.notes[0]}
                                            </Form.Control.Feedback>
                                        </FormFloating>
                                        <Button variant="primary" size="lg" type="submit" disabled={formLoading}>
                                            {formLoading ? "Saving..." : "Update"}
                                        </Button>
                                        <Button
                                            variant="outline-secondary"
                                            className="ms-2"
                                            size="lg"
                                            onClick={handleCancel}
                                            disabled={formLoading}
                                        >
                                            Cancel
                                        </Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            )}
        </>
    );
}