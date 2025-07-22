import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';

function MainPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        links: [],
    });

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: ""
    });
    const [formError, setFormError] = useState({});
    const [modalLoading, setModalLoading] = useState(false);
    const [editUserId, setEditUserId] = useState(null);

    // Fetch users
    const fetchUsers = async (page = 1, keyword = "") => {
        setLoading(true);
        try {
            const response = await axios.get(
                `/users?page=${page}${keyword ? `&search=${encodeURIComponent(keyword)}` : ""}`
            );
            const data = response.data.data;
            setUsers(data.datas || []);
            setPagination({
                currentPage: data.currentPage,
                lastPage: data.lastPage,
                links: data.links,
            });
        } catch (error) {
            setUsers([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers(1, "");
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(1, search);
    };

    const handlePageClick = (pageUrl, pageLabel) => {
        if (!pageUrl || pageLabel === "...") return;
        const urlParams = new URLSearchParams(pageUrl.split("?")[1]);
        const page = urlParams.get("page") || 1;
        fetchUsers(page, search);
    };

    // Modal logic
    const handleShowModal = () => {
        setModalMode('create');
        setEditUserId(null);
        setFormData({
            name: "",
            email: "",
            password: "",
            password_confirmation: ""
        });
        setFormError({});
        setShowModal(true);
    };

    const handleShowEditModal = (user) => {
        setModalMode('edit');
        setEditUserId(user.id);
        setFormData({
            name: user.name || "",
            email: user.email || "",
            password: "",
            password_confirmation: ""
        });
        setFormError({});
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmitModal = async (e) => {
        e.preventDefault();
        setModalLoading(true);
        setFormError({});
        if (modalMode === 'create') {
            // Create user
            try {
                await axios.post("/users/store", formData);
                setModalLoading(false);
                setShowModal(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'User berhasil dibuat.',
                    showConfirmButton: false,
                    timer: 1500
                });
                fetchUsers(pagination.currentPage, search);
            } catch (err) {
                setModalLoading(false);
                if (err.response && err.response.status === 422) {
                    setFormError(err.response.data.message || {});
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal membuat user',
                        text: err.response?.data?.message || "Terjadi kesalahan, silakan coba lagi."
                    });
                }
            }
        } else if (modalMode === 'edit' && editUserId) {
            // Edit user
            try {
                await axios.put(`/users/${editUserId}/update`, formData);
                setModalLoading(false);
                setShowModal(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'User berhasil diupdate.',
                    showConfirmButton: false,
                    timer: 1500
                });
                fetchUsers(pagination.currentPage, search);
            } catch (err) {
                setModalLoading(false);
                if (err.response && err.response.status === 422) {
                    setFormError(err.response.data.message || {});
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gagal update user',
                        text: err.response?.data?.message || "Terjadi kesalahan, silakan coba lagi."
                    });
                }
            }
        }
    };

    // Delete user
    const handleDeleteUser = async (user) => {
        const result = await Swal.fire({
            title: 'Yakin ingin hapus user ini?',
            text: `User: ${user.name} (${user.email})`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Hapus',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#d33',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/users/${user.id}/delete`);
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: 'User berhasil dihapus.',
                    showConfirmButton: false,
                    timer: 1500
                });
                fetchUsers(pagination.currentPage, search);
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal hapus user',
                    text: err.response?.data?.message || "Terjadi kesalahan, silakan coba lagi."
                });
            }
        }
    };

    // Avatar helper (fallback: inisial, or default image)
    const renderAvatar = (user) => {
        // Ganti user.avatar sesuai field yang tersedia dari API
        // Fallback: gunakan avatar dari backend, else pakai gravatar, else pakai inisial
        let avatarUrl = user.avatar;
        if (!avatarUrl && user.email) {
            // Gravatar fallback
            const emailHash = window.btoa(user.email.trim().toLowerCase());
            avatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=mp`;
        }
        return (
            <img
                src={avatarUrl}
                alt={user.name}
                style={{
                    width: 32,
                    height: 32,
                    objectFit: 'cover',
                    borderRadius: '50%',
                    marginRight: 8,
                    verticalAlign: 'middle'
                }}
                onError={(e) => {
                    // inisial fallback
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name
                    )}&size=32`;
                }}
            />
        );
    };

    return (
        <Container className="container" style={{marginTop: '80px'}}>
            <Card>
                <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
                    <span className="text-primary">User Management</span>
                    <button className="btn btn-primary btn-sm" onClick={handleShowModal}>Add User</button>
                </Card.Header>
                <Card.Body>
                    {/* Search Form */}
                    <form className="mb-3 d-flex" onSubmit={handleSearch}>
                        <input
                            type="text"
                            className="form-control me-2"
                            placeholder="Search name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary">Search</button>
                    </form>

                    {/* Table */}
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <Table striped bordered hover w-100>
                            <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center">No data.</td>
                                </tr>
                            ) : (
                                users.map((user, idx) => (
                                    <tr key={user.id || idx}>
                                        <td>{idx + 1 + ((pagination.currentPage - 1) * 20)}</td>
                                        <td>
                                            {/* Avatar + Name */}
                                            <span className="d-flex align-items-center">
                                                {renderAvatar(user)}
                                                {user.name}
                                            </span>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-warning me-2"
                                                onClick={() => handleShowEditModal(user)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDeleteUser(user)}
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </Table>
                    )}

                    {/* Pagination */}
                    {pagination.links.length > 1 && (
                        <nav>
                            <ul className="pagination justify-content-center">
                                {pagination.links.map((link, idx) => (
                                    <li
                                        key={idx}
                                        className={`page-item${link.active ? " active" : ""}${!link.url ? " disabled" : ""}`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageClick(link.url, link.label)}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            disabled={!link.url || link.label === "..."}
                                        />
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}
                </Card.Body>
            </Card>

            {/* Modal Create/Edit User */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <form onSubmit={handleSubmitModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {modalMode === 'create' ? 'Create User' : 'Edit User'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="mb-3">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                className={`form-control ${formError.name ? 'is-invalid' : ''}`}
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                            {formError.name && (
                                <div className="invalid-feedback">
                                    {formError.name[0]}
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className={`form-control ${formError.email ? 'is-invalid' : ''}`}
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                            {formError.email && (
                                <div className="invalid-feedback">
                                    {formError.email[0]}
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password {modalMode === 'edit' && <small>(Kosongkan jika tidak ganti)</small>}</label>
                            <input
                                type="password"
                                className={`form-control ${formError.password ? 'is-invalid' : ''}`}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required={modalMode === 'create'}
                                autoComplete="new-password"
                            />
                            {formError.password && (
                                <div className="invalid-feedback">
                                    {formError.password[0]}
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                className={`form-control ${formError.password_confirmation ? 'is-invalid' : ''}`}
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleInputChange}
                                required={modalMode === 'create'}
                                autoComplete="new-password"
                            />
                            {formError.password_confirmation && (
                                <div className="invalid-feedback">
                                    {formError.password_confirmation[0]}
                                </div>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal} disabled={modalLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={modalLoading}>
                            {modalLoading ? (modalMode === 'create' ? "Saving..." : "Updating...") : (modalMode === 'create' ? "Save" : "Update")}
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </Container>
    );
}

export default MainPage;