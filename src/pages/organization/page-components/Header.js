import React
    from "react";
import {
    Alert
} from "react-bootstrap";

const Header = ({name, orgId} ) => {
    return (
        <Alert
            variant="primary"
            className="mb-4 border-2 border-primary"
        >
            <dl className="row mb-0">
                <dd className="col-md-4 mb-0">Organization Name</dd>
                <dt className="col-md-8 mb-2">{name ? name : "Loading..."}</dt>
                <dd className="col-md-4 mb-0">Organization ID</dd>
                <dt className="col-md-8">{orgId ? orgId : "Loading..."}</dt>
            </dl>
        </Alert>
    )
}

export default Header;