import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');

    // Jika token tidak ada, redirect ke halaman login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Jika token ada, tampilkan komponen anak
    return children;
}

export default ProtectedRoute;