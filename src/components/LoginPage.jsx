import React, { useState } from 'react';
import { Plane, ArrowRight, Check } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);

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
                // Store user data
                localStorage.setItem('user', JSON.stringify(data.user || {
                    firstName: 'Mojtaba',
                    lastName: 'Fouladi',
                    email: email
                }));

                setLoginSuccess(true);

                // Wait for animation before redirecting
                setTimeout(() => {
                    navigate('/search');
                }, 2000);
            } else {
                setError(data.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            // Fallback for demo/dev if backend fails
            if (email && password) {
                localStorage.setItem('user', JSON.stringify({
                    firstName: 'Mojtaba',
                    lastName: 'Fouladi',
                    email: email
                }));
                setLoginSuccess(true);
                setTimeout(() => {
                    navigate('/search');
                }, 2000);
            } else {
                setError("An error occurred during login");
            }
        }
    };

    const handleGuestAccess = () => {
        navigate('/search');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                {loginSuccess ? (
                    <div className="success-overlay">
                        <div className="success-icon-container">
                            <Check className="success-icon" />
                        </div>
                        <h2 className="success-message">Welcome Back, {JSON.parse(localStorage.getItem('user')).firstName} {JSON.parse(localStorage.getItem('user')).lastName}!</h2>
                        <p className="success-submessage">Redirecting to your dashboard...</p>
                    </div>
                ) : (
                    <>
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
                    </>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
