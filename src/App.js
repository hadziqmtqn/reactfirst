import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from "./template/Navbar";
import ProtectedRoute from "./auth/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import { AppInfoProvider } from "./context/AppInfoContext";
import AppInfoUpdater from "./components/AppMetaUpdater";
import NotFound from './pages/NotFound';

import UserPage from "./dashboard/users/Page";
import LoginPage from "./auth/Login";
import OrganizationPage from "./dashboard/organization/Page";
import ZohoConfigPage from "./dashboard/zoho-config/Page";
import CustomerTablePage from './dashboard/customers/Page';
import CustomerDetailPage from "./dashboard/customers/DetailPage";
import { AuthMeProvider } from "./context/AuthMeContext";

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
            <AppInfoUpdater />
            <AuthMeProvider>
                <Router>
                    <Routes>
                        {/* Routes dengan Navbar */}
                        <Route element={<LayoutWithNavbar />}>
                            <Route path="/" element={<LandingPage />} />

                            <Route path="/users" element={
                                <ProtectedRoute>
                                    <UserPage />
                                </ProtectedRoute>
                            }/>

                            <Route path="/customers" element={
                                <ProtectedRoute>
                                    <CustomerTablePage />
                                </ProtectedRoute>
                            }/>

                            <Route path="/customers/:organization/:customerId" element={
                                <ProtectedRoute>
                                    <CustomerDetailPage />
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

                        {/* Routes tanpa Navbar */}
                        <Route element={<LayoutNoNavbar />}>
                            <Route path="/login" element={<LoginPage />} />
                        </Route>

                        {/* Not Found */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            </AuthMeProvider>
        </AppInfoProvider>
    );
}

export default App;