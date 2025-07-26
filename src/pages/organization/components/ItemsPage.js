import React from 'react';
import { usePageTitle } from "../../../hooks/usePageTitle";
import { useAppInfo } from "../../../context/AppInfoContext";
import { Breadcrumb, Card, Container, Row, Col } from "react-bootstrap";
import { Link , useParams } from "react-router-dom";
import Sidebar from "../page-components/Sidebar";
import { organizationSidebarItems } from '../page-components/SidebarConfig';

const ConfigPage = () => {
    const { appName } = useAppInfo();
    usePageTitle(`Items | ${appName}`);

    const { organizationSlug } = useParams();
    const sidebarItems = organizationSidebarItems(organizationSlug);

    return (
        <Container style={{ marginTop: "80px" }}>
            <Breadcrumb>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/dashboard" }}>
                    Dashboard
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Items</Breadcrumb.Item>
            </Breadcrumb>

            <Row>
                {/* Sidebar kiri */}
                <Col xs={12} md={3} className="mb-4">
                    <Sidebar items={sidebarItems} />
                </Col>

                {/* Konten utama kanan */}
                <Col xs={12} md={9}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <Card.Title as="h4" className="mb-4 fw-bold">
                                Items
                            </Card.Title>
                            {/* Konten utama di sini */}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ConfigPage;