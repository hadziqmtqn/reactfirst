import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./template/Navbar";
import ProtectedRoute from "./auth/ProtectedRoute";
import { AppInfoProvider } from "./context/AppInfoContext";
import { AuthMeProvider } from "./context/AuthMeContext";
import { AuthProvider } from "./context/AuthContext";
import AppInfoUpdater from "./components/AppMetaUpdater";
import ToastifyContainer from "./components/ToastifyContainer";
import NotFound from './components/NotFound';

import DashboardPage from "./pages/dashboard/DashboardPage";
import UserPage from "./pages/users/Page";
import LoginPage from "./pages/auth/Login";
import OrganizationPage from "./pages/organization/Page";
import ZohoConfigPage from "./pages/zoho-config/Page";
import CustomerTablePage from './pages/customers/Page';
import CustomerDetailPage from "./pages/customers/DetailPage";

function App() {
    return (
        <>
            <ToastifyContainer />
            <AuthProvider>
                <AppInfoProvider>
                    <AppInfoUpdater />
                    <AuthMeProvider>
                        <Router>
                            <Routes>
                                <Route element={<Navbar />}>
                                    <Route path="/dashboard" element={
                                        <ProtectedRoute>
                                            <DashboardPage />
                                        </ProtectedRoute>
                                    } />

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

                                    <Route path="/" element={<LoginPage />} />
                                </Route>

                                {/* Not Found */}
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Router>
                    </AuthMeProvider>
                </AppInfoProvider>
            </AuthProvider>
        </>
    );
}

export default App;