import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useAppInfo } from "../../context/AppInfoContext";
import { toast } from "react-toastify";
import axios from "../../api/axios";

import OrganizationList from "../../components/organization/GetOrganizations";
import OrganizationModal from "../../components/organization/Modal";
import { Button } from "react-bootstrap";

function Page() {
    const { appName } = useAppInfo();
    usePageTitle(`Dashboard | ${appName}`);

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [formData, setFormData] = useState({
        name: '',
        organization_id: ''
    });
    const [formError, setFormError] = useState({});
    const [loading, setLoading] = useState(false);

    const [editingOrganization, setEditingOrganization] = useState(null);
    // trigger re-render when editingOrganization changes
    const [refreshKey, setRefreshKey] = useState(0);

    const handleAdd = () => {
        setModalMode('create');
        setFormData({
            name: '',
            organization_id: ''
        });
        setFormError({});
        setLoading(false);
        setEditingOrganization(null);
        setShowModal(true);
    }

    const handleEdit = (organization) => {
        setModalMode('edit');
        setFormData({
            name: organization.name,
            organization_id: organization.organizationId
        });
        setFormError({});
        setLoading(false);
        setEditingOrganization(organization);
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            name: '',
            organization_id: ''
        });
        setFormError({});
        setLoading(false);
        setEditingOrganization(null);
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormError({});

        try {
            if (modalMode === 'create') {
                await axios.post('/organization/store', formData);
            } else {
                await axios.put(`/organization/${editingOrganization.slug}/update`, formData);
            }

            toast.success(`Organization ${modalMode === 'create' ? 'created' : 'updated'} successfully!`);
            handleCloseModal();

            // Refresh the organization list
            setRefreshKey(prevKey => prevKey + 1);
        } catch (error) {
            if (error.response && error.response.data.message) {
                setFormError(error.response.data.message);
            } else {
                toast.error('An error occurred while processing your request.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container style={{marginTop: '80px'}}>
            <Card className="mb-4">
                <Card.Body className="text-center">
                    <h1>Welcome to {appName}</h1>
                    <p className="text-muted">Manage your organizations efficiently.</p>
                </Card.Body>
            </Card>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Organization List</h4>
                <Button variant="success" onClick={handleAdd}>
                    <i className="bi bi-plus-circle me-2"></i>Add Organization
                </Button>
            </div>

            <OrganizationList onEdit={handleEdit} refreshKey={refreshKey} />

            <OrganizationModal
                show={showModal}
                mode={modalMode}
                formData={formData}
                formError={formError}
                loading={loading}
                onClose={handleCloseModal}
                onChange={handleFormChange}
                onSubmit={handleFormSubmit}
            />
        </Container>
    );
}

export default Page;