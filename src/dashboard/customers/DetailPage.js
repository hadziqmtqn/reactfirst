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
    Form,
    Button,
    FormFloating
} from "react-bootstrap";
import Swal from "sweetalert2";
import { useAppInfo } from "../../context/AppInfoContext";
import { usePageTitle } from "../../components/hooks/usePageTitle";
import SimpleBreadcrumb from "../../components/SimpleBreadcrumb";

export default function CustomerDetailPage() {
    const { organization, customerId } = useParams();
    const { appName } = useAppInfo();
    usePageTitle(`Customer Detail | ${appName}`);

    const [customer, setCustomer] = useState({
        contact_name: "",
        contact_id: "",
        contact_number: "",
        company_name: "",
        email: "",
        mobile: "",
        website: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);

    // Fetch customer data
    const fetchCustomer = async () => {
        setLoading(true);
        setErrors({});
        try {
            const res = await axios.get(`/customers/${organization}/${customerId}`);
            if (res.data?.data) {
                setCustomer(res.data.data);
            } else {
                setCustomer(null);
            }
        } catch (err) {
            setCustomer(null);
            await Swal.fire({
                icon: "error",
                title: "Gagal mengambil data customer",
                text: err.response?.data?.message || "Terjadi kesalahan, silakan coba lagi."
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCustomer();
        // eslint-disable-next-line
    }, [organization, customerId]);

    // Handle input change & clear error for field
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer({
            ...customer,
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
                contact_name: customer.contact_name,
                company_name: customer.company_name,
                email: customer.email,
                mobile: customer.mobile,
                website: customer.website
            });
            if (res.data.success) {
                await Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: "Data customer berhasil diupdate.",
                    showConfirmButton: false,
                    timer: 1500
                });
                setCustomer(res.data.data);
                await fetchCustomer();
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal update",
                    text: typeof res.data.message === "string" ? res.data.message : "Terjadi kesalahan."
                });
            }
        } catch (err) {
            // Tangani error 422 dari backend
            if (err.response && err.response.status === 422 && err.response.data.message) {
                setErrors(err.response.data.message || {});
            } else {
                await Swal.fire({
                    icon: "error",
                    title: "Gagal update",
                    text: err.response?.data?.message || "Terjadi kesalahan, silakan coba lagi."
                });
            }
        }
        setFormLoading(false);
    };

    if (loading) return (
        <Container className="container" style={{ marginTop: '80px' }}>
            <div className="text-center my-5">
                <Spinner animation="border" variant="primary" />
            </div>
        </Container>
    );
    if (!customer) return (
        <Container className="container" style={{ marginTop: '80px' }}>
            <Alert variant="warning">Data customer tidak ditemukan.</Alert>
        </Container>
    );

    return (
        <Container className="container" style={{ marginTop: '80px' }}>
            <SimpleBreadcrumb
                items={[
                    { label: "Home", href: "/" },
                    { label: "Customers", href: `/customers` },
                    { label: customer.contact_name || "Detail", active: true }
                ]}
            />
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
                            <Form onSubmit={handleSubmit} noValidate>
                                <FormFloating className="mb-3">
                                    <Form.Control
                                        type="text"
                                        name="contact_name"
                                        value={customer.contact_name}
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
                                        value={customer.contact_id}
                                        onChange={handleChange}
                                        isInvalid={!!errors.contact_id}
                                        placeholder="Contact ID"
                                        disabled="true"
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
                                        value={customer.contact_number}
                                        onChange={handleChange}
                                        isInvalid={!!errors.contact_number}
                                        placeholder="Contact Number"
                                        disabled="true"
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
                                        value={customer.company_name}
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
                                        value={customer.email}
                                        onChange={handleChange}
                                        isInvalid={!!errors.email}
                                        placeholder="Email"
                                        disabled="true"
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
                                        value={customer.mobile}
                                        onChange={handleChange}
                                        isInvalid={!!errors.mobile}
                                        placeholder="Mobile"
                                        disabled="true"
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
                                        value={customer.website}
                                        onChange={handleChange}
                                        isInvalid={!!errors.website}
                                        placeholder="Website"
                                    />
                                    <Form.Label column="" htmlFor="website">Website</Form.Label>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.website && errors.website[0]}
                                    </Form.Control.Feedback>
                                </FormFloating>
                                <Button variant="primary" size="lg" type="submit" disabled={formLoading}>
                                    {formLoading ? "Saving..." : "Update"}
                                </Button>
                                <Button
                                    variant="outline-secondary"
                                    className="ms-2"
                                    size="lg"
                                    onClick={fetchCustomer}
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
    );
}