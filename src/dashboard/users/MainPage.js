import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Swal from 'sweetalert2';

import UserTable from "../../components/users/UserTable";
import UserModal from "../../components/users/Modal";

function MainPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        links: [],
    });

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: ""
    });
    const [formError, setFormError] = useState({});
    const [modalLoading, setModalLoading] = useState(false);
    const [editUserId, setEditUserId] = useState(null);

    // Fetch
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

    // Handlers
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
                await fetchUsers(pagination.currentPage, search);
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
                await fetchUsers(pagination.currentPage, search);
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal hapus user',
                    text: err.response?.data?.message || "Terjadi kesalahan, silakan coba lagi."
                });
            }
        }
    };

    return (
        <Container className="container" style={{marginTop: '80px'}}>
            <Card>
                <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
                    <span className="text-primary">User Management</span>
                    <button className="btn btn-secondary btn-sm" onClick={handleShowModal}>Add User</button>
                </Card.Header>
                <Card.Body>
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
                    <UserTable
                        users={users}
                        pagination={pagination}
                        loading={loading}
                        onEdit={handleShowEditModal}
                        onDelete={handleDeleteUser}
                        onPageClick={handlePageClick}
                    />
                </Card.Body>
            </Card>
            <UserModal
                show={showModal}
                mode={modalMode}
                formData={formData}
                formError={formError}
                loading={modalLoading}
                onClose={handleCloseModal}
                onChange={handleInputChange}
                onSubmit={handleSubmitModal}
            />
        </Container>
    );
}

export default MainPage;