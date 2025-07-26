import React, { useEffect, useState } from "react";
import { Container, Card, Form, Button, Spinner, FormFloating } from "react-bootstrap";
import axios from "axios";
//import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom"; // tambahkan useLocation
import { useAppInfo } from "../context/AppInfoContext";
import ToastAlert
    from "../components/ToastContainer";

function Login() {
    const { appName, appLogo } = useAppInfo();
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    //const location = useLocation(); // ambil location

    // Ambil path asal dari location.state
    //const from = location.state?.from?.pathname || "/";

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) navigate('/dashboard'); // jika sudah login, redirect ke dashboard
    }, [navigate]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            const res = await axios.post(`${API_URL}/login`, {
                email: form.email,
                password: form.password
            });

            localStorage.setItem('token', res.data.data);
            navigate('/dashboard');
        } catch (err) {
            if (err.response && err.response.status === 422 && err.response.data.message) {
                setErrors(err.response.data.message || {});
            } else {
                /*await Swal.fire({
                    icon: "error",
                    title: "Login Gagal",
                    text: err.response?.data?.message || "Terjadi kesalahan, silakan coba lagi."
                });*/
                ToastAlert({
                    variant: "error",
                    message: err.response?.data?.message || "Terjadi kesalahan, silakan coba lagi."
                });
                setErrors({});
            }
        }
        setLoading(false);
    };

    return (
        <Container style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxWidth: "400px"
        }}>
            <Card className="shadow w-100">
                <Card.Body>
                    <div className="text-center mb-4">
                        <a href="/" className="text-decoration-none">
                            {appLogo && (
                                <img
                                    src={appLogo}
                                    alt="Logo"
                                    width="50"
                                    className="mb-2 me-2"
                                />
                            )}
                            <span className="fw-bold fs-4">{appName || "MyApp"}</span>
                        </a>
                    </div>
                    <p className="text-center mb-4">Silakan masuk untuk melanjutkan</p>
                    <Form onSubmit={handleSubmit} noValidate>
                        <FormFloating className="mb-3">
                            <Form.Control
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Email address"
                                value={form.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                                required
                                autoFocus
                            />
                            <Form.Label column="" htmlFor="email">Email address</Form.Label>
                            <Form.Control.Feedback type="invalid">
                                {errors.email && errors.email[0]}
                            </Form.Control.Feedback>
                        </FormFloating>
                        <FormFloating className="mb-3">
                            <Form.Control
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Password"
                                value={form.password}
                                onChange={handleChange}
                                isInvalid={!!errors.password}
                                required
                            />
                            <Form.Label column="" htmlFor="password">Password</Form.Label>
                            <Form.Control.Feedback type="invalid">
                                {errors.password && errors.password[0]}
                            </Form.Control.Feedback>
                        </FormFloating>
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-100"
                            disabled={loading}
                            size="lg"
                        >
                            {loading ? <Spinner animation="border" size="sm" /> : "Login"}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Login;