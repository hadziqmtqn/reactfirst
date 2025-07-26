import React, { useState, useEffect } from "react";
import {
    Modal,
    Button,
    Form,
    FormFloating,
    Spinner
} from "react-bootstrap";
import axios from "../../api/axios";
import ToastAlert from "../ToastAlert"; // Pastikan path import sudah benar

export default function CustomerCreateModal({ show, onClose, organizations = [], onCreated }) {
    const [formData, setFormData] = useState({
        organization_id: "",
        contact_name: "",
        company_name: "",
        website: "",
        notes: ""
    });
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Toast state
    const [toastShow, setToastShow] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const showToast = (message, variant = "success") => {
        setToastMessage(message);
        setToastVariant(variant);
        setToastShow(true);
    };

    // Reset data saat modal dibuka/dtutup
    useEffect(() => {
        if (!show) {
            setFormData({
                organization_id: organizations[0]?.id?.toString() || "",
                contact_name: "",
                company_name: "",
                website: "",
                notes: ""
            });
            setFormErrors({});
            setLoading(false);
            setToastShow(false); // Reset toast
        } else if (organizations.length > 0 && !formData.organization_id) {
            setFormData(prev => ({
                ...prev,
                organization_id: organizations[0].id.toString()
            }));
        }
        // eslint-disable-next-line
    }, [show, organizations]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.organization_id) {
            setFormErrors({ organization_id: ["Organization harus dipilih!"] });
            showToast("Organization harus dipilih!", "error");
            return;
        }
        setLoading(true);
        setFormErrors({});
        try {
            const res = await axios.post("/customers/store", {
                organization_id: formData.organization_id,
                contact_name: formData.contact_name,
                company_name: formData.company_name,
                website: formData.website,
                notes: formData.notes
            });
            if (res.data.success) {
                showToast("Customer berhasil ditambahkan!", "primary");
                if (onCreated) onCreated(res.data.data);
                setTimeout(() => {
                    setFormData({
                        organization_id: organizations[0]?.id?.toString() || "",
                        contact_name: "",
                        company_name: "",
                        website: "",
                        notes: ""
                    });
                    onClose();
                }, 800); // Tutup modal setelah toast
            } else {
                setFormErrors(res.data.message || {});
                showToast(
                    typeof res.data.message === "string"
                        ? res.data.message
                        : "Gagal menambah customer.",
                    "danger"
                );
            }
        } catch (err) {
            if (
                err.response &&
                err.response.status === 422 &&
                err.response.data.message
            ) {
                setFormErrors(err.response.data.message || {});
                showToast("Ada field yang salah, periksa kembali.", "error");
            } else {
                setFormErrors({ general: "Terjadi kesalahan saat membuat customer." });
                showToast("Terjadi kesalahan saat membuat customer.", "error");
            }
        }
        setLoading(false);
    };

    return (
        <Modal show={show} onHide={onClose} backdrop="static">
            <ToastAlert
                show={toastShow}
                onClose={() => setToastShow(false)}
                message={toastMessage}
                variant={toastVariant}
            />
            <Modal.Header closeButton>
                <Modal.Title>Tambah Customer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} noValidate>
                    <FormFloating className="mb-3">
                        <Form.Select
                            name="organization_id"
                            value={formData.organization_id}
                            onChange={handleChange}
                            isInvalid={!!formErrors.organization_id}
                            required
                        >
                            {organizations.length === 0 && (
                                <option value="">-- Pilih Organisasi --</option>
                            )}
                            {organizations.map(org => (
                                <option key={org.id} value={org.id}>{org.name}</option>
                            ))}
                        </Form.Select>
                        <Form.Label column="" htmlFor="organization_id">Organization</Form.Label>
                        <Form.Control.Feedback type="invalid">
                            {formErrors.organization_id && formErrors.organization_id[0]}
                        </Form.Control.Feedback>
                    </FormFloating>
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