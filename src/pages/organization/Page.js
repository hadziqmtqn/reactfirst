import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";

import {
    Container,
    Card,
    Form,
    Button,
    Spinner,
    FormFloating
} from "react-bootstrap";

import Swal from "sweetalert2";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useAppInfo } from "../../context/AppInfoContext";

function OrganizationPage() {
    const { appName } = useAppInfo();
    usePageTitle(`Organization Settings | ${appName}`);

    const [organization, setOrganization] = useState({
        name: "",
        organizationId: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);

    // Fetch organization data
    const fetchOrganization = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/organization");
            if (res.data.success && res.data.data) {
                setOrganization({
                    id: res.data.data.id,
                    name: res.data.data.name,
                    organizationId: res.data.data.organizationId
                });
            }
        } catch (err) {
            await Swal.fire({
                icon: "error",
                title: "Gagal mengambil data",
                text: err.response?.data?.message || "Terjadi kesalahan, silakan coba lagi."
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrganization();
    }, []);

    // Handle input change & clear error for field
    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrganization({
            ...organization,
            [name]: value
        });

        // Hapus error pada field yang diubah
        if (name === "name" && errors.name) {
            setErrors({ ...errors, name: undefined });
        }
        if (name === "organizationId" && errors.organization_id) {
            setErrors({ ...errors, organization_id: undefined });
        }
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setErrors({});
        try {
            const res = await axiosInstance.post("/organization/store", {
                name: organization.name,
                organization_id: organization.organizationId
            });
            if (res.data.success) {
                await Swal.fire({
                    icon: "success",
                    title: "Berhasil",
                    text: "Data organisasi berhasil diupdate.",
                    showConfirmButton: false,
                    timer: 1500
                });
                await fetchOrganization();
            } else {
                // Jika error bukan validasi, tampilkan swal
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

    return (
        <Container style={{ marginTop: "80px" }}>
            <Card className="shadow-sm">
                <Card.Body>
                    <Card.Title as="h4" className="mb-4 fw-bold">Organization Settings</Card.Title>
                    {loading ? (
                        <div className="text-center my-5">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    ) : (
                        <Form onSubmit={handleSubmit} noValidate>
                            <FormFloating className="mb-3">
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={organization.name}
                                    onChange={handleChange}
                                    isInvalid={!!errors.name}
                                    required
                                    placeholder="Organization Name"
                                />
                                <Form.Label column="" htmlFor="name">Organization Name</Form.Label>
                                <Form.Control.Feedback type="invalid">
                                    {errors.name && errors.name[0]}
                                </Form.Control.Feedback>
                            </FormFloating>
                            <FormFloating className="mb-3">
                                <Form.Control
                                    type="text"
                                    name="organizationId"
                                    value={organization.organizationId}
                                    onChange={handleChange}
                                    isInvalid={!!errors.organization_id}
                                    required
                                    placeholder="Organization ID"
                                />
                                <Form.Label column="" htmlFor="organizationId">Organization ID</Form.Label>
                                <Form.Control.Feedback type="invalid">
                                    {errors.organization_id && errors.organization_id[0]}
                                </Form.Control.Feedback>
                            </FormFloating>
                            <Button variant="primary" size={"lg"} type="submit" disabled={formLoading}>
                                {formLoading ? "Saving..." : "Submit"}
                            </Button>

                            <Button
                                variant="outline-secondary"
                                className="ms-2"
                                size={"lg"}
                                onClick={() => fetchOrganization()}
                                disabled={formLoading}
                            >
                                Cancel
                            </Button>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default OrganizationPage;