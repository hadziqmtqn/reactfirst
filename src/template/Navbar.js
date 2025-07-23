import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";

import { useAppInfo } from "../context/AppInfoContext"; // Import context

function AppNavbar() {
    const { appName, appLogo } = useAppInfo(); // Use context to get app info
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Konfirmasi Logout',
            text: 'Apakah Anda yakin ingin logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Logout',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#d33',
        });

        if (result.isConfirmed) {
            try {
                await axios.post(
                    `${API_URL}/logout`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } catch (err) {
                // Tidak masalah jika error, tetap logout di client
            }
            localStorage.removeItem("token");
            Swal.fire({
                icon: 'success',
                title: 'Berhasil Logout',
                showConfirmButton: false,
                timer: 1200
            });
            navigate("/login");
        }
    };

    return (
        <Navbar bg="dark" variant="dark" expand="md" fixed="top">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    {appLogo && (
                        <img
                            src={appLogo}
                            width="30"
                            height="30"
                            alt={appName}
                            className="d-inline-block align-top me-2"
                        />
                    )}
                    {appName || "MyApp"}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/" active={window.location.pathname === "/"}>Home</Nav.Link>

                        <Nav.Link as={Link} to="/users" active={window.location.pathname === "/users"}>Users</Nav.Link>

                        <Nav.Link as={Link} to="/organization" active={window.location.pathname === "/organization"}>Organization</Nav.Link>

                        <Nav.Link as={Link} to="/zoho-config" active={window.location.pathname === "/zoho-config"}>Zoho Config</Nav.Link>
                    </Nav>
                    <Nav>
                        {token ? (
                            <Button variant="outline-warning" onClick={handleLogout}>
                                Logout
                            </Button>
                        ) : (
                            <Button as={Link} to="/login" variant="outline-success">
                                Login
                            </Button>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;