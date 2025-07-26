import React from "react";
import AppNavbar from "./AppNavbar";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { token } = useAuth();

    return (
        <>
            {token && <AppNavbar />}
            <Outlet />
        </>
    );
}

export default Navbar;