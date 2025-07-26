import React, {
    useState
} from "react";
import { NavLink } from "react-router-dom";
import {
    Container,
    Navbar,
    Nav,
    Dropdown,
    NavDropdown
} from "react-bootstrap";
import { useAppInfo } from "../context/AppInfoContext";
import { useAuthMe } from "../context/AuthMeContext";
import useLogout from "../../src/components/hooks/Logout";
import ToastAlert
    from "../components/ToastContainer";

function AppNavbar() {
    const { appName, appLogo } = useAppInfo();
    const authMe = useAuthMe();

    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [toastVariant, setToastVariant] = useState("success");

    const logout = useLogout({
        onSuccess: (msg, variant) => {
            setToastMsg(msg);
            setToastVariant(variant);
            setShowToast(true);
        }
    });

    // Helper untuk mengecek src valid/tidak kosong/null
    const hasValidSrc = val => !!val && val.trim() !== "";

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="md" fixed="top">
                <Container>
                    <Navbar.Brand as={NavLink} to="/">
                        {hasValidSrc(appLogo) && (
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
                            <Nav.Link as={NavLink} to="/dashboard">Dashboard</Nav.Link>
                            <Nav.Link as={NavLink} to="/users">Users</Nav.Link>
                            <Nav.Link as={NavLink} to="/customers">Customers</Nav.Link>
                            <NavDropdown title="Settings" id="basic-nav-dropdown">
                                <NavDropdown.Item as={NavLink} to="/organization">Organization</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/zoho-config">Zoho Config</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Nav>
                            <Dropdown align="end">
                                <Dropdown.Toggle as="a" className="d-block link-light text-decoration-none" style={{ cursor: "pointer", padding: 0 }}>
                                    {hasValidSrc(authMe.avatar) ? (
                                        <img
                                            src={authMe.avatar}
                                            alt="Avatar"
                                            width="32"
                                            height="32"
                                            className="rounded-circle"
                                        />
                                    ) : (
                                        // Optional: fallback avatar, e.g., icon or initials
                                        <span className="rounded-circle bg-secondary d-inline-block" style={{ width: 32, height: 32 }} />
                                    )}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="text-small">
                                    <Dropdown.Item as={NavLink} to="/new-project">New project...</Dropdown.Item>
                                    <Dropdown.Item as={NavLink} to="/settings">Settings</Dropdown.Item>
                                    <Dropdown.Item as={NavLink} to="/profile">Profile</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item as="button" className="text-danger" onClick={logout}>Sign out</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <ToastAlert
                show={showToast}
                onClose={() => setShowToast(false)}
                message={toastMsg}
                variant={toastVariant}
            />
        </>
    );
}

export default AppNavbar;