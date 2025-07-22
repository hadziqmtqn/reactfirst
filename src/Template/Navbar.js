import React from "react";
import {Link} from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div className="container-fluid">
            <Link className="navbar-brand" to="/">Fixed navbar</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav me-auto mb-2 mb-md-0">
                <li className="nav-item">
                    <Link to="/" className="nav-link active" aria-current="page">Home</Link>
                </li>
            </ul>
            <div className="d-flex">
                <Link to="/login" className="btn btn-outline-success">Login</Link>
            </div>
            </div>
        </div>
        </nav>
    );
}

export default Navbar;