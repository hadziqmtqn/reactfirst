import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

import {
    Container,
    Navbar,
    Nav,
    Button,
    Dropdown,
    NavDropdown
} from "react-bootstrap";

import { useAppInfo } from "../context/AppInfoContext";
import { useAuthMe } from "../context/AuthMeContext";

function AppNavbar() {
    const { appName, appLogo } = useAppInfo();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const authMe = useAuthMe();

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
                await axios.post(`${API_URL}/logout`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {}
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
                <Navbar.Brand as={NavLink} to="/">
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
                        <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                        {token && (
                            <>
                                <Nav.Link as={NavLink} to="/users">Users</Nav.Link>
                                <Nav.Link as={NavLink} to="/customers">Customers</Nav.Link>
                                <NavDropdown title="Setting" id="basic-nav-dropdown">
                                    <NavDropdown.Item as={NavLink} to="/organization">Organization</NavDropdown.Item>
                                    <NavDropdown.Item as={NavLink} to="/zoho-config">Zoho Config</NavDropdown.Item>
                                </NavDropdown>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        {token ? (
                            <Dropdown align="end">
                                <Dropdown.Toggle as="a" className="d-block link-light text-decoration-none" style={{ cursor: "pointer", padding: 0 }}>
                                    <img
                                        src={authMe.avatar}
                                        alt="Avatar"
                                        width="32"
                                        height="32"
                                        className="rounded-circle"
                                    />
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="text-small">
                                    <Dropdown.Item as={NavLink} to="/new-project">New project...</Dropdown.Item>
                                    <Dropdown.Item as={NavLink} to="/settings">Settings</Dropdown.Item>
                                    <Dropdown.Item as={NavLink} to="/profile">Profile</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item as="button" className="text-danger" onClick={handleLogout}>Sign out</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <Button as={NavLink} to="/login" variant="success">
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