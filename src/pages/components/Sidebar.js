import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ items }) => {
    const location = useLocation();

    return (
        <ListGroup className="shadow-sm">
            {items.map(item => (
                <ListGroup.Item
                    key={item.to}
                    as={Link}
                    to={item.to}
                    action
                    active={location.pathname === item.to}
                >
                    {item.label}
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

export default Sidebar;