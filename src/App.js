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

import Page from "./pages/dashboard/Page";
import UserPage from "./pages/users/Page";
import LoginPage from "./pages/auth/Login";
import CustomerTablePage from './pages/customers/Page';
import CustomerDetailPage from "./pages/customers/DetailPage";
import ConfigPage from "./pages/zoho-config/Page";
import CustomersPage from "./pages/customers/CustomersPage";
import ItemsPage from "./pages/items/ItemsPage";

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
                                            <Page />
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

                                    <Route path="/zoho-config/:organizationSlug" element={
                                        <ProtectedRoute>
                                            <ConfigPage />
                                        </ProtectedRoute>
                                    }/>

                                    <Route path="/customers/:organizationSlug" element={
                                        <ProtectedRoute>
                                            <CustomersPage />
                                        </ProtectedRoute>
                                    }/>

                                    <Route path="/items/:organizationSlug" element={
                                        <ProtectedRoute>
                                            <ItemsPage />
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