import React, { useState } from 'react';
import { Plane, ArrowRight, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // TODO: Implement actual login logic with backend
        console.log("Login with:", email, password);
        navigate('/search');
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
