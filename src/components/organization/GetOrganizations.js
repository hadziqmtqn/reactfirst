import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import {
    useNavigate
} from "react-router-dom";

const OrganizationList = ({ onEdit, refreshKey }) => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const response = await axios.get('/organization');
                setOrganizations(response.data.data);
            } catch (err) {
                setError("Error fetching organizations");
            } finally {
                setLoading(false);
            }
        };

        fetchOrganizations();
    }, [refreshKey]);

    if (loading) {
        return (
            <div className="text-center my-4">
                <Spinner animation="border" role="status" />
            </div>
        );
    }

    if (error) {
        return toast.error('Data organisasi gagal dimuat');
    }

    if (organizations.length === 0) {
        return <p className="text-center">No organizations found.</p>;
    }

    return (
        <Row>
            {organizations.map(org => (
                <Col md={4} key={org.id || org.slug}>
                    <Card className="mb-4 border-2" border="primary">
                        <Card.Body>
                            <Card.Title as="h4">{org.name}</Card.Title>
                            {/* Ganti Card.Text dengan div */}
                            <div>
                                <dl>
                                    <dd className="mb-0">Organization ID</dd>
                                    <dt className="mb-2">{org.organizationId}</dt>
                                </dl>
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <Row>
                                <Col lg={8} md={8}>
                                    <Button variant="primary" className="w-100" onClick={() => navigate(`/items/${org.slug}`)}>
                                        Open
                                    </Button>
                                </Col>
                                <Col lg={4} md={4}>
                                    <Button variant="outline-secondary" className="w-100" onClick={() => onEdit && onEdit(org)}>
                                        Edit
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default OrganizationList;