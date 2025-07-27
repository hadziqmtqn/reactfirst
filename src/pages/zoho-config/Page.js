import React, { useEffect, useState } from 'react';
import { usePageTitle } from "../../hooks/usePageTitle";
import { useAppInfo } from "../../context/AppInfoContext";
import {
    Breadcrumb,
    Card,
    Container,
    Row,
    Col,
    Form,
    FormFloating,
    Button,
    Spinner
} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { organizationSidebarItems } from '../components/SidebarConfig';
import axios from "../../api/axios";
import { toast } from "react-toastify";
import Header from "../components/Header";

const ConfigPage = () => {
    const { appName } = useAppInfo();
    usePageTitle(`Organization Settings | ${appName}`);

    const { organizationSlug } = useParams();
    const sidebarItems = organizationSidebarItems(organizationSlug);

    const [zohoConfig, setZohoConfig] = useState({
        organizationSlug: "",
        organizationName: "",
        organizationId: "",
        code: "",
        clientId: "",
        clientSecret: "",
        redirectUrl: "",
        refreshToken: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);

    const fetchZohoConfig = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/zoho-config/${organizationSlug}`);
            if (res.data.success && res.data.data) {
                setZohoConfig({
                    organizationSlug: res.data.data.organizationSlug, // pastikan field ini benar
                    organizationName: res.data.data.organizationName,
                    organizationId: res.data.data.organizationId,
                    code: res.data.data.code,
                    clientId: res.data.data.clientId,
                    clientSecret: res.data.data.clientSecret,
                    redirectUrl: res.data.data.redirectUrl,
                    refreshToken: res.data.data.refreshToken
                });
            } else {
                toast.error('Data konfigurasi Zoho tidak ditemukan.');
            }
        } catch (err) {
            toast.error('Gagal mengambil data konfigurasi Zoho. Silakan coba lagi.');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchZohoConfig();
        // eslint-disable-next-line
    }, [organizationSlug]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setZohoConfig(prev => ({
            ...prev,
            [name]: value
        }));

        // Hapus error pada field yang diubah
        setErrors(prev => ({
            ...prev,
            [name]: undefined
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setErrors({});
        try {
            const res = await axios.post(`/zoho-config/${organizationSlug}/update`, {
                '_method': 'PUT',
                code: zohoConfig.code,
                client_id: zohoConfig.clientId,
                client_secret: zohoConfig.clientSecret,
                redirect_url: zohoConfig.redirectUrl,
                refresh_token: zohoConfig.refreshToken
            });
            if (res.data.success) {
                toast.success(res.data.message || "Konfigurasi Zoho berhasil diperbarui.");
                await fetchZohoConfig();
            } else {
                toast.error(res.data.message || "Gagal memperbarui konfigurasi Zoho.");
            }
        } catch (err) {
            if (err.response && err.response.status === 422 && err.response.data.message) {
                setErrors(err.response.data.message || {});
            } else {
                toast.error("Terjadi kesalahan saat memperbarui konfigurasi Zoho. Silakan coba lagi.");
            }
        }
        setFormLoading(false);
    };

    return (
        <Container style={{ marginTop: "80px" }}>
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/dashboard" }}>
                    Dashboard
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Setting</Breadcrumb.Item>
            </Breadcrumb>
            <Row>
                <Col xs={12} md={3} className="mb-4">
                    <Sidebar items={sidebarItems} />
                </Col>
                <Col xs={12} md={9}>
                    <Header name={zohoConfig.organizationName} orgId={zohoConfig.organizationId} />
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title as="h4" className="mb-4 fw-bold">
                                Configuration
                            </Card.Title>
                            {loading ? (
                                <div className="text-center my-4">
                                    <Spinner animation="border" variant="primary" />
                                </div>
                            ) : (
                                <Form onSubmit={handleSubmit} noValidate>
                                    <Row className="mb-3">
                                        <Col md={12}>
                                            <FormFloating className="mb-3">
                                                <Form.Control
                                                    type="text"
                                                    name="code"
                                                    value={zohoConfig.code}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.code}
                                                    required
                                                    placeholder="Code"
                                                />
                                                <Form.Label column="" htmlFor="code">Code</Form.Label>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.code && errors.code[0]}
                                                </Form.Control.Feedback>
                                            </FormFloating>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <FormFloating className="mb-3">
                                                <Form.Control
                                                    type="text"
                                                    name="clientId"
                                                    value={zohoConfig.clientId}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.client_id}
                                                    required
                                                    placeholder="Client ID"
                                                />
                                                <Form.Label column="" htmlFor="clientId">Client ID</Form.Label>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.client_id && errors.client_id[0]}
                                                </Form.Control.Feedback>
                                            </FormFloating>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <FormFloating className="mb-3">
                                                <Form.Control
                                                    type="password"
                                                    name="clientSecret"
                                                    value={zohoConfig.clientSecret}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.client_secret}
                                                    required
                                                    placeholder="Client Secret"
                                                />
                                                <Form.Label column="" htmlFor="clientSecret">Client Secret</Form.Label>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.client_secret && errors.client_secret[0]}
                                                </Form.Control.Feedback>
                                            </FormFloating>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <FormFloating className="mb-3">
                                                <Form.Control
                                                    type="text"
                                                    name="redirectUrl"
                                                    value={zohoConfig.redirectUrl}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.redirect_url}
                                                    required
                                                    placeholder="Redirect URL"
                                                />
                                                <Form.Label column="" htmlFor="redirectUrl">Redirect URI</Form.Label>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.redirect_url && errors.redirect_url[0]}
                                                </Form.Control.Feedback>
                                            </FormFloating>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <FormFloating className="mb-3">
                                                <Form.Control
                                                    type="text"
                                                    name="refreshToken"
                                                    value={zohoConfig.refreshToken}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.refresh_token}
                                                    placeholder="Refresh Token"
                                                />
                                                <Form.Label column="" htmlFor="refreshToken">Refresh Token</Form.Label>
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.refresh_token && errors.refresh_token[0]}
                                                </Form.Control.Feedback>
                                            </FormFloating>
                                        </Col>
                                    </Row>
                                    <Button variant="primary" type="submit" size="lg" disabled={formLoading}>
                                        {formLoading ? "Saving..." : "Submit"}
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        size="lg"
                                        className="ms-2"
                                        onClick={fetchZohoConfig}
                                        disabled={formLoading}
                                    >
                                        Cancel
                                    </Button>
                                </Form>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ConfigPage;