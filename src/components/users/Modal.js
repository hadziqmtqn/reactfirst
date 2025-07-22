import React from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

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
                {/* Name */}
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className={`form-control ${formError.name ? 'is-invalid' : ''}`}
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        required
                    />
                    {formError.name && (
                        <div className="invalid-feedback">
                            {formError.name[0]}
                        </div>
                    )}
                </div>
                {/* Email */}
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className={`form-control ${formError.email ? 'is-invalid' : ''}`}
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                        required
                    />
                    {formError.email && (
                        <div className="invalid-feedback">
                            {formError.email[0]}
                        </div>
                    )}
                </div>
                {/* Password */}
                <div className="mb-3">
                    <label className="form-label">Password {mode === 'edit' && <small>(Kosongkan jika tidak ganti)</small>}</label>
                    <input
                        type="password"
                        className={`form-control ${formError.password ? 'is-invalid' : ''}`}
                        name="password"
                        value={formData.password}
                        onChange={onChange}
                        required={mode === 'create'}
                        autoComplete="new-password"
                    />
                    {formError.password && (
                        <div className="invalid-feedback">
                            {formError.password[0]}
                        </div>
                    )}
                </div>
                {/* Confirm Password */}
                <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        className={`form-control ${formError.password_confirmation ? 'is-invalid' : ''}`}
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={onChange}
                        required={mode === 'create'}
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
                <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? (mode === 'create' ? "Saving..." : "Updating...") : (mode === 'create' ? "Save" : "Update")}
                </Button>
            </Modal.Footer>
        </form>
    </Modal>
);

export default UserModal;