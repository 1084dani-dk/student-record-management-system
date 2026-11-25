
import { useState } from 'react';
import { loginAdmin } from '../services/authService';

function Login({ onLoginSuccess }) {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle login
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');

        if (!formData.email.trim() || !formData.password) {
            setError('Please enter email and password.');
            return;
        }

        try {
            setLoading(true);

            const response = await loginAdmin(formData);

            if (response.success) {
                onLoginSuccess(response.admin);
            } else {
                setError(response.message || 'Login failed.');
            }

        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Unable to connect to server. Please try again.'
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-4">

            <div className="card shadow border-0" style={{ width: '100%', maxWidth: '420px' }}>

                <div className="card-body p-4 p-md-5">

                    <div className="text-center mb-4">

                        <div className="mb-3">
                            <i className="bi bi-shield-lock-fill text-primary"
                                style={{ fontSize: '3rem' }}>
                            </i>
                        </div>

                        <h3 className="fw-bold">Admin Login</h3>

                        <p className="text-muted">
                            Sign in to manage student records
                        </p>

                    </div>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">

                            <label className="form-label fw-semibold">
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                className="form-control form-control-lg"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="mb-4">

                            <label className="form-label fw-semibold">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                className="form-control form-control-lg"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-100"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-box-arrow-in-right me-2"></i>
                                    Login
                                </>
                            )}

                        </button>

                    </form>

                    <div className="text-center mt-4">
                        <small className="text-muted">
                            Student Records Management System
                        </small>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Login;
