import React from "react";

import {
    Modal,
    Button,
    FormFloating,
    Form
} from "react-bootstrap";

const UserModal = ({
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
                    {mode === 'create' ? 'Create User' : 'Edit User'}
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
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                        placeholder="Email"
                        className={`form-control ${formError.email ? 'is-invalid' : ''}`}
                        required
                    />
                    <label>Email</label>
                    {formError.email && (
                        <div className="invalid-feedback">
                            {formError.email[0]}
                        </div>
                    )}
                </FormFloating>
                <FormFloating className="mb-3">
                    <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={onChange}
                        placeholder="Password"
                        className={`form-control ${formError.password ? 'is-invalid' : ''}`}
                        required={mode === 'create'}
                        autoComplete="new-password"
                    />
                    <label>Password {mode === 'edit' && <small>(Kosongkan jika tidak ganti)</small>}</label>
                    {formError.password && (
                        <div className="invalid-feedback">
                            {formError.password[0]}
                        </div>
                    )}
                </FormFloating>
                <FormFloating className="mb-3">
                    <Form.Control
                        type="password"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={onChange}
                        placeholder="Confirm Password"
                        className={`form-control ${formError.password_confirmation ? 'is-invalid' : ''}`}
                        required={mode === 'create'}
                        autoComplete="new-password"
                    />
                    <label>Confirm Password</label>
                    {formError.password_confirmation && (
                        <div className="invalid-feedback">
                            {formError.password_confirmation[0]}
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

export default UserModal;