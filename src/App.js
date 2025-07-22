import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./Template/Navbar";
import MainPage from "./Dashboard/MainPage";
import Login from "./Auth/Login";
import ProtectedRoute from "./Auth/ProtectedRoute";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={
                    <ProtectedRoute>
                        <MainPage />
                    </ProtectedRoute>
                }/>
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;