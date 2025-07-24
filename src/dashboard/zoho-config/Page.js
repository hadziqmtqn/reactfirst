import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios"; // gunakan instance custom
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Swal from "sweetalert2";
import { usePageTitle } from "../../components/hooks/usePageTitle";
import { useAppInfo } from "../../context/AppInfoContext";

function ZohoConfigPage() {
    const { appName } = useAppInfo();
    usePageTitle(`Zoho Configuration | ${appName}`);

    const [zohoConfig, setZohoConfig] = useState({
        id: "",
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

    // Fetch organization data
    const fetchZohoConfig = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/zoho-config");
            if (res.data.success && res.data.data) {
                setZohoConfig({
                    id: res.data.data.id,
                    organizationName: res.data.data.organizationName,
                    organizationId: res.data.data.organizationId,
                    code: res.data.data.code,
                    clientId: res.data.data.clientId,
                    clientSecret: res.data.data.clientSecret,
                    redirectUrl: res.data.data.redirectUrl,
                    refreshToken: res.data.data.refreshToken
                });
            }
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Gagal mengambil data",
                text: err.response?.data?.message || "Terjadi kesalahan, silakan coba lagi."
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchZohoConfig();
    }, []);

    // Handle input change & clear error for field
    const handleChange = (e) => {
        const { name, value } = e.target;
        setZohoConfig({
            ...zohoConfig,
            [name]: value
        });

        // Hapus error pada field yang diubah
        if (name === "code" && errors.code) {
            setErrors({ ...errors, code: undefined });
        }
        if (name === "clientId" && errors.client_id) {
            setErrors({ ...errors, client_id: undefined });
        }
        if (name === "clientSecret" && errors.client_secret) {
            setErrors({ ...errors, client_secret: undefined });
        }
        if (name === "redirectUrl" && errors.redirect_url) {
            setErrors({ ...errors, redirect_url: undefined });
        }
        if (name === "refreshToken" && errors.refresh_token) {
            setErrors({ ...errors, refresh_token: undefined });
        }
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setErrors({});
        try {
            const res = await axiosInstance.post(`zoho-config/${zohoConfig.id}/update`, {
                '_method': 'PUT',
                code: zohoConfig.code,
                client_id: zohoConfig.clientId,
                client_secret: zohoConfig.clientSecret,
                redirect_url: zohoConfig.redirectUrl,
                refresh_token: zohoConfig.refreshToken
            });
            if (res.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: "Data berhasil diupdate.",
                    showConfirmButton: false,
                    timer: 1500
                });
                fetchZohoConfig();
            } else {
                // Jika error bukan validasi, tampilkan swal
                Swal.fire({
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
                Swal.fire({
                    icon: "error",
                    title: "Gagal update",
                    text: err.response?.data?.message || "Terjadi kesalahan, silakan coba lagi."
                });
            }
        }
        setFormLoading(false);
    };

    return (
        <Container style={{ marginTop: "80px" }}>
            <Card>
                <Card.Header as="h5">
                    Zoho Configuration
                </Card.Header>
                <Card.Body>
                    {loading ? (
                        <div className="text-center my-5">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : (
                        <Form onSubmit={handleSubmit} noValidate>
                            <Alert variant="info">
                                <strong>Organization Name:</strong> {zohoConfig.organizationName || "N/A"}<br />
                                <strong>Organization ID:</strong> {zohoConfig.organizationId || "N/A"}
                            </Alert>

                            <Row className="mb-3">
                                <Col xs={12} md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Code</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="code"
                                            value={zohoConfig.code}
                                            onChange={handleChange}
                                            isInvalid={!!errors.code}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.code && errors.code[0]}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Client ID</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="clientId"
                                            value={zohoConfig.clientId}
                                            onChange={handleChange}
                                            isInvalid={!!errors.client_id}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.client_id && errors.client_id[0]}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Client Secret</Form.Label>
                                        <Form.Control
                                            type="password"
                                            name="clientSecret"
                                            value={zohoConfig.clientSecret}
                                            onChange={handleChange}
                                            isInvalid={!!errors.client_secret}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.client_secret && errors.client_secret[0]}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Redirect URI</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="redirectUrl"
                                            value={zohoConfig.redirectUrl}
                                            onChange={handleChange}
                                            isInvalid={!!errors.redirect_url}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.redirect_url && errors.redirect_url[0]}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col xs={12} md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Refresh Token</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="refreshToken"
                                            value={zohoConfig.refreshToken}
                                            onChange={handleChange}
                                            isInvalid={!!errors.refresh_token}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.refresh_token && errors.refresh_token[0]}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button variant="primary" type="submit" disabled={formLoading}>
                                {formLoading ? "Saving..." : "Update Settings"}
                            </Button>
                            {/* reset button */}
                            <Button
                                variant="secondary"
                                className="ms-2"
                                onClick={() => fetchZohoConfig()}
                                disabled={formLoading}
                            >
                                Reset
                            </Button>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default ZohoConfigPage;