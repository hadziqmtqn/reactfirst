import React, {
    useEffect,
    useState
} from 'react';
import { usePageTitle } from "../../../hooks/usePageTitle";
import { useAppInfo } from "../../../context/AppInfoContext";
import {
    Breadcrumb,
    Card,
    Container,
    Row,
    Col,
    Alert
} from "react-bootstrap";
import { Link , useParams } from "react-router-dom";
import Sidebar from "../page-components/Sidebar";
import { organizationSidebarItems } from '../page-components/SidebarConfig';
import axios from "../../../api/axios";
import {
    toast
} from "react-toastify";

const ConfigPage = () => {
    const { appName } = useAppInfo();
    usePageTitle(`Organization Settings | ${appName}`);

    const { organizationSlug } = useParams();
    const sidebarItems = organizationSidebarItems(organizationSlug);

    // fetch data
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

    // Fetch organization data
    const fetchZohoConfig = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/zoho-config/${organizationSlug}`);
            if (res.data.success && res.data.data) {
                setZohoConfig({
                    organizationSLug: res.data.data.organizationSLug,
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
            toast.error('Gagal mengambil data konfigurasi Zoho. Silakan coba lagi.');
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
            const res = await axios.post(`zoho-config/${organizationSlug}/update`, {
                '_method': 'PUT',
                code: zohoConfig.code,
                client_id: zohoConfig.clientId,
                client_secret: zohoConfig.clientSecret,
                redirect_url: zohoConfig.redirectUrl,
                refresh_token: zohoConfig.refreshToken
            });
            if (res.data.success) {
                toast.success("Konfigurasi Zoho berhasil diperbarui.");
                await fetchZohoConfig();
            } else {
                // Jika error bukan validasi, tampilkan swal
                toast.error(res.data.message || "Gagal memperbarui konfigurasi Zoho.");
            }
        } catch (err) {
            // Tangani error 422 dari backend
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
                {/* Sidebar kiri */}
                <Col xs={12} md={3} className="mb-4">
                    <Sidebar items={sidebarItems} />
                </Col>

                {/* Konten utama kanan */}
                <Col xs={12} md={9}>
                    <Alert
                        variant="primary"
                        className="mb-4"
                    >
                        <dl className="row mb-0">
                            <dd className="col-md-4 mb-0">Organization Name</dd>
                            <dt className="col-md-8 mb-2">{zohoConfig.organizationName ? zohoConfig.organizationName : "Loading..."}</dt>
                            <dd className="col-md-4 mb-0">Organization ID</dd>
                            <dt className="col-md-8 mb-2">{zohoConfig.organizationId ? zohoConfig.organizationId : "Loading..."}</dt>
                        </dl>
                    </Alert>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title as="h4" className="mb-4 fw-bold">
                                Configuration
                            </Card.Title>
                            {/* Konten utama di sini */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ConfigPage;