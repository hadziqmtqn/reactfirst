import React, { useState, useEffect } from "react";
import {
    Modal,
    Button,
    Form,
    FormFloating,
    Spinner
} from "react-bootstrap";
import axios from "../../api/axios";
import { toast } from "react-toastify";

export default function CustomerCreateModal({ show, onClose, organizationSlug, onCreated }) {
    const [formData, setFormData] = useState({
        contact_name: "",
        company_name: "",
        website: "",
        notes: ""
    });
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Reset data saat modal dibuka/dtutup
    useEffect(() => {
        if (!show) {
            setFormData({
                contact_name: "",
                company_name: "",
                website: "",
                notes: ""
            });
            setFormErrors({});
            setLoading(false);
        }
        // eslint-disable-next-line
    }, [show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormErrors({});
        try {
            const res = await axios.post(`/customers/${organizationSlug}/store`, {
                contact_name: formData.contact_name,
                company_name: formData.company_name,
                website: formData.website,
                notes: formData.notes
            });
            if (res.data.success) {
                toast.success(res.data.message || "Customer has been created successfully.");
                if (onCreated) onCreated(res.data.data);
                setTimeout(() => {
                    setFormData({
                        contact_name: "",
                        company_name: "",
                        website: "",
                        notes: ""
                    });
                    onClose();
                }, 800); // Tutup modal setelah toast
            } else {
                setFormErrors(res.data.message || {});
                toast.error(res.data.message || "Failed to create customer.");
            }
        } catch (err) {
            if (
                err.response &&
                err.response.status === 422 &&
                err.response.data.message
            ) {
                setFormErrors(err.response.data.message || {});
                toast.error("Please check the form fields.");
            } else {
                setFormErrors({ general: "Terjadi kesalahan saat membuat customer." });
                toast.error("Terjadi kesalahan saat membuat customer.");
            }
        }
        setLoading(false);
    };

    return (
        <Modal show={show} onHide={onClose} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Tambah Customer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} noValidate>
                    <FormFloating className="mb-3">
                        <Form.Control
                            type="text"
                            name="contact_name"
                            value={formData.contact_name}
                            onChange={handleChange}
                            isInvalid={!!formErrors.contact_name}
                            placeholder="Contact Name"
                            required
                        />
                        <Form.Label column="" htmlFor="contact_name">Contact Name</Form.Label>
                        <Form.Control.Feedback type="invalid">
                            {formErrors.contact_name && formErrors.contact_name[0]}
                        </Form.Control.Feedback>
                    </FormFloating>
                    <FormFloating className="mb-3">
                        <Form.Control
                            type="text"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            isInvalid={!!formErrors.company_name}
                            placeholder="Company Name"
                            required
                        />
                        <Form.Label column="" htmlFor="company_name">Company Name</Form.Label>
                        <Form.Control.Feedback type="invalid">
                            {formErrors.company_name && formErrors.company_name[0]}
                        </Form.Control.Feedback>
                    </FormFloating>
                    <FormFloating className="mb-3">
                        <Form.Control
                            type="text"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            isInvalid={!!formErrors.website}
                            placeholder="Website"
                        />
                        <Form.Label column="" htmlFor="website">Website</Form.Label>
                        <Form.Control.Feedback type="invalid">
                            {formErrors.website && formErrors.website[0]}
                        </Form.Control.Feedback>
                    </FormFloating>
                    <FormFloating className="mb-3">
                        <Form.Control
                            as="textarea"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            isInvalid={!!formErrors.notes}
                            placeholder="Notes"
                            style={{ minHeight: "80px" }}
                        />
                        <Form.Label column="" htmlFor="notes">Notes</Form.Label>
                        <Form.Control.Feedback type="invalid">
                            {formErrors.notes && formErrors.notes[0]}
                        </Form.Control.Feedback>
                    </FormFloating>
                    <div className="d-flex gap-2">
                        <Button size={"lg"} variant="primary" type="submit" disabled={loading} className="flex-grow-1">
                            {loading ? <Spinner animation="border" size="sm" className="me-2" /> : null}
                            Create
                        </Button>
                        <Button size={"lg"} variant="secondary" type="button" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}