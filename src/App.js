import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from "./template/Navbar";
import ProtectedRoute from "./auth/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import { AppInfoProvider } from "./context/AppInfoContext";
import NotFound from './pages/NotFound';

import UserPage from "./dashboard/users/MainPage";
import LoginPage from "./auth/Login";
import OrganizationPage from "./dashboard/organization/Page";
import ZohoConfigPage from "./dashboard/zoho-config/Page";

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
                                <UserPage />
                            </ProtectedRoute>
                        }/>

                        <Route path="/organization" element={
                            <ProtectedRoute>
                                <OrganizationPage />
                            </ProtectedRoute>
                        }/>

                        <Route path="/zoho-config" element={
                            <ProtectedRoute>
                                <ZohoConfigPage />
                            </ProtectedRoute>
                        }/>
                    </Route>

                    <Route element={<LayoutNoNavbar />}>
                        <Route path="/login" element={<LoginPage />} />
                    </Route>
                    
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </AppInfoProvider>
    );
}

export default App;