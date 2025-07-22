import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./Template/Navbar";
import MainPage from "./Template/MainPage";
import Login from "./Auth/Login";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;