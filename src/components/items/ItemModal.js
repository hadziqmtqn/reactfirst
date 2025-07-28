import React from "react";
import {
    Modal,
    Button,
    FormFloating,
    Form,
    ListGroup,
    Row,
    Col
} from "react-bootstrap";

const ItemModal = ({show, mode, formData, formError, loading, onClose, onChange, onSubmit}) => (
    <Modal show={show} onHide={onClose}>
        <form onSubmit={onSubmit}>
            <Modal.Header closeButton>
                <Modal.Title>
                    {mode === 'create' ? 'Create Item' : 'Edit Item'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="mb-3">
                    <Col xs={12} className="mb-2">Product Type</Col>
                    <Col>
                        <ListGroup>
                            <ListGroup.Item as="label">
                                <Form.Check
                                    type="radio"
                                    name="product_type"
                                    value="goods"
                                    label="Goods"
                                    checked={formData.product_type === 'goods'}
                                    onChange={onChange}
                                    className={`mb-0 ${formError.product_type ? 'is-invalid' : ''}`}
                                    required
                                />
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col>
                        <ListGroup>
                            <ListGroup.Item as="label">
                                <Form.Check
                                    type="radio"
                                    name="product_type"
                                    value="service"
                                    label="Service"
                                    checked={formData.product_type === 'service'}
                                    onChange={onChange}
                                    className={`mb-0 ${formError.product_type ? 'is-invalid' : ''}`}
                                    required
                                />
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    {formError.type && (
                        <Col xs={12}>
                            <div className="invalid-feedback d-block">
                                {formError.product_type[0]}
                            </div>
                        </Col>
                    )}
                </Row>
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
                        type="number"
                        name="rate"
                        value={formData.rate}
                        onChange={onChange}
                        placeholder="Rate/Price"
                        className={`form-control ${formError.rate ? 'is-invalid' : ''}`}
                        required
                    />
                    <label>Rate/Price</label>
                    {formError.rate && (
                        <div className="invalid-feedback">
                            {formError.rate[0]}
                        </div>
                    )}
                </FormFloating>
                <FormFloating className="mb-3">
                    <Form.Control
                        as="textarea"
                        name="description"
                        value={formData.description}
                        onChange={onChange}
                        placeholder="Description"
                        className={`form-control ${formError.description ? 'is-invalid' : ''}`}
                        style={{ minHeight: '100px' }}
                    />
                    <label>Description</label>
                    {formError.description && (
                        <div className="invalid-feedback">
                            {formError.description[0]}
                        </div>
                    )}
                </FormFloating>
            </Modal.Body>
            <Modal.Footer>
                <div className="d-grid gap-2 w-100">
                    <Button type="submit" variant="primary" disabled={loading} size={"lg"}>
                        {loading
                            ? mode === 'create'
                                ? "Saving..."
                                : "Updating..."
                            : mode === 'create'
                                ? "Save"
                                : "Update"}
                    </Button>
                    <Button variant="secondary" onClick={onClose} disabled={loading} size={"lg"}>Cancel</Button>
                </div>
            </Modal.Footer>
        </form>
    </Modal>
);

export default ItemModal;