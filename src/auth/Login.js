import React, {useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    const API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
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
            localStorage.setItem('token', response.data.data);
            navigate('/');
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setError(err.response.data.message || {});
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Gagal',
                    text: err.response?.data?.message || "Terjadi kesalahan, silakan coba lagi."
                });
                setError({});
            }
        }
        setLoading(false);
    };

    return(
        <main
            className="container"
            style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                maxWidth: '400px'
            }}
        >
            <div className="card shadow w-100">
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
                                onChange={e => {
                                    setEmail(e.target.value);
                                    if (error.email) setError(prev => ({ ...prev, email: undefined }));
                                }}
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
                                onChange={e => {
                                    setPassword(e.target.value);
                                    if (error.password) setError(prev => ({ ...prev, password: undefined }));
                                }}
                                name="password"
                            />
                            {error.password && (
                                <div className="invalid-feedback">
                                    {error.password[0]}
                                </div>
                            )}
                        </div>
                        {/* error.general dihilangkan karena sekarang pakai Swal */}
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