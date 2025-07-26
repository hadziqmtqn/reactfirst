import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import axios from "../../api/axios";
import ToastAlert
    from "../ToastContainer";

const OrganizationList = () => {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
    }, []);

    if (loading) {
        return (
            <div className="text-center my-4">
                <Spinner animation="border" role="status" />
            </div>
        );
    }

    if (error) {
        return <ToastAlert
            variant="danger"
            message={error}
            show={true}
            onClose={() => setError(null)}
        />;
    }

    if (organizations.length === 0) {
        return <p className="text-center">No organizations found.</p>;
    }

    return (
        <Row>
            {organizations.map(org => (
                <Col md={4} key={org.id}>
                    <Card className="mb-4 border-2" border="primary">
                        <Card.Body>
                            <Card.Title as="h4">{org.name}</Card.Title>
                            <Card.Text>
                                <dl>
                                    <dd className="mb-0">Organization ID</dd>
                                    <dt className="mb-2">{org.organizationId}</dt>
                                </dl>
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <Row>
                                <Col lg={8} md={8}>
                                    <Button as="a" variant="primary" href={`/organization/${org.slug}`} className="w-100">
                                        Buka
                                    </Button>
                                </Col>
                                <Col lg={4} md={4}>
                                    <Button as="a" variant="outline-secondary" href={`/organization/${org.slug}/edit`} className="w-100">
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