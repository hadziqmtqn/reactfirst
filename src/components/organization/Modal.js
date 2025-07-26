import React from "react";

import {
    Modal,
    Button,
    FormFloating,
    Form
} from "react-bootstrap";

const OrganizationModal = ({
   show,
   mode,
   formData,
   formError,
   loading,
   onClose,
   onChange,
   onSubmit
}) => (
    <Modal show={show} onHide={onClose}>
        <form onSubmit={onSubmit}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {mode === 'create' ? 'Create Organization' : 'Edit Organization'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormFloating className="mb-3">
                    <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        placeholder="Name"
                        className={`form-control ${formError.name ? 'is-invalid' : ''}`}
                        required
                    />
                    <label>Name</label>
                    {formError.name && (
                        <div className="invalid-feedback">
                            {formError.name[0]}
                        </div>
                    )}
                </FormFloating>
                <FormFloating className="mb-3">
                    <Form.Control
                        type="text"
                        name="organization_id"
                        value={formData.organization_id}
                        onChange={onChange}
                        placeholder="Organization ID"
                        className={`form-control ${formError.organization_id ? 'is-invalid' : ''}`}
                        required
                    />
                    <label>Organization ID</label>
                    {formError.organization_id && (
                        <div className="invalid-feedback">
                            {formError.organization_id[0]}
                        </div>
                    )}
                </FormFloating>
            </Modal.Body>
            <Modal.Footer>
                <div className="d-grid gap-2 w-100">
                    <Button type="submit" variant="primary" disabled={loading} size={"lg"}>
                        {loading ? (mode === 'create' ? "Saving..." : "Updating...") : (mode === 'create' ? "Save" : "Update")}
                    </Button>
                    <Button variant="secondary" onClick={onClose} disabled={loading} size={"lg"}>Cancel</Button>
                </div>
            </Modal.Footer>
        </form>
    </Modal>
);

export default OrganizationModal;