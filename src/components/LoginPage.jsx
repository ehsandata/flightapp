import React, { useState } from 'react';
import { Plane, ArrowRight, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // TODO: Store user data/token
                console.log("Login successful:", data);
                navigate('/search');
            } else {
                setError(data.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("An error occurred during login");
        }
    };

    const handleGuestAccess = () => {
        navigate('/search');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <Plane className="auth-logo" size={48} />
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to access your flight history</p>
                </div>

                <form className="auth-form" onSubmit={handleLogin}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div style={{ color: 'red', marginTop: '10px', fontSize: '14px' }}>{error}</div>}

                    <button type="submit" className="auth-btn btn-primary">
                        Sign In
                    </button>
                </form>

                <div className="divider">
                    <span>or</span>
                </div>

                <button onClick={handleGuestAccess} className="auth-btn btn-secondary">
                    Continue as Guest <ArrowRight size={18} />
                </button>

                <div className="auth-footer">
                    Don't have an account?
                    <Link to="/register" className="auth-link">Create Account</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
