import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import {
    Spinner
} from "react-bootstrap";

function ProtectedRoute({ children }) {
    const [tokenChecked, setTokenChecked] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Simulasi cek token (bisa juga cek ke server jika perlu)
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
        setTokenChecked(true);
    }, []);

    if (!tokenChecked) {
        return <div className="text-center gy-4">
            <Spinner variant="primary" animation="border" role="status" />
        </div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;