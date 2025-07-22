import React, {useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        // Cek apakah user sudah login
        const token = localStorage.getItem('token');
        if (token) {
            // Jika sudah login, redirect ke halaman utama
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError({});
        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/login`,
                { email, password }
            );
            // Handle success...
            localStorage.setItem('token', response.data.data.token);

            navigate('/'); // Use useNavigate hook to redirect
        } catch (err) {
            // Error dari API (422)
            if (err.response && err.response.status === 422) {
                setError(err.response.data.message || {});
            } else {
                setError({ general: err.response.data.message || "Terjadi kesalahan, silakan coba lagi." });
            }
        }
        setLoading(false);
    };

    return(
        <main className="container" style={{marginTop: '100px', maxWidth: '400px'}}>
            <div className="card shadow">
                <div className="card-body">
                    <h3 className="mb-4 text-center">Login</h3>
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email address</label>
                            <input
                                type="email"
                                className={`form-control ${error.email ? 'is-invalid' : ''}`}
                                id="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                name="email"
                            />
                            {error.email && (
                                <div className="invalid-feedback">
                                    {error.email[0]}
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className={`form-control ${error.password ? 'is-invalid' : ''}`}
                                id="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                name="password"
                            />
                            {error.password && (
                                <div className="invalid-feedback">
                                    {error.password[0]}
                                </div>
                            )}
                        </div>
                        {error.general && <div className="alert alert-danger">{error.general}</div>}
                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? "Loading..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default Login;
