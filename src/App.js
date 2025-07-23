import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from "./template/Navbar";
import MainPage from "./dashboard/users/MainPage";
import Login from "./auth/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import { AppInfoProvider } from "./context/AppInfoContext";

// Layout dengan Navbar
function LayoutWithNavbar() {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}

// Layout tanpa Navbar
function LayoutNoNavbar() {
    return <Outlet />;
}

function App() {
    return (
        <AppInfoProvider>
            <Router>
                <Routes>
                    <Route element={<LayoutWithNavbar />}>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/users" element={
                            <ProtectedRoute>
                                <MainPage />
                            </ProtectedRoute>
                        }/>
                    </Route>
                    <Route element={<LayoutNoNavbar />}>
                        <Route path="/login" element={<Login />} />
                    </Route>
                </Routes>
            </Router>
        </AppInfoProvider>
    );
}

export default App;