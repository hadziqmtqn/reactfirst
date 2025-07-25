import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";

export default function ToastContainerSederhana({ show, onClose, message, variant = "success" }) {
    return (
        <ToastContainer position="top-center" className="p-3" style={{ zIndex: 1080 }}>
            <Toast show={show} onClose={onClose} delay={2500} autohide>
                <Toast.Header style={{ border: "none" }}>
                    <i className={`bi bi-${variant === "primary" ? "check-circle-fill text-primary" : variant === "danger" ? "x-circle-fill text-danger" : "info-circle-fill text-danger"} me-2`} style={{ fontSize: "14pt" }}></i>
                    <strong className="me-auto mt-2 mb-2">{message}</strong>
                </Toast.Header>
            </Toast>
        </ToastContainer>
    );
}