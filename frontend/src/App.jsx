
import { useState, useEffect, useCallback } from 'react';

import Navbar from './components/Navbar';
import Login from './components/Login';
import StudentForm from './components/StudentForm';
import StudentTable from './components/StudentTable';

import {
    getStudents,
    deleteStudent
} from './services/studentService';

import {
    checkAuth,
    logoutAdmin
} from './services/authService';

function App() {

    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(true);

    const [authLoading, setAuthLoading] = useState(true);

    const [admin, setAdmin] = useState(null);

    const [error, setError] = useState('');

    const [message, setMessage] = useState('');

    const [selectedStudent, setSelectedStudent] = useState(null);

    // Fetch students from PHP API
    const loadStudents = useCallback(async () => {

        try {

            setError('');

            const response = await getStudents();

            if (response.success) {
                setStudents(response.students);
            }

        } catch (err) {

            setError(
                err.response?.data?.message ||
                'Unable to load student records. Check PHP server.'
            );

        } finally {

            setLoading(false);

        }

    }, []);

    // Check admin session when application starts
    useEffect(() => {

        const verifyAdmin = async () => {

            try {

                const response = await checkAuth();

                if (response.success && response.authenticated) {

                    setAdmin(response.admin);

                    await loadStudents();

                }

            } catch (err) {

                setAdmin(null);
                setLoading(false);

            } finally {

                setAuthLoading(false);

            }

        };

        verifyAdmin();

    }, [loadStudents]);

    // Handle successful login
    const handleLoginSuccess = async (adminData) => {

        setAdmin(adminData);

        setMessage('Login successful!');
        setError('');

        setLoading(true);

        await loadStudents();

    };

    // Handle logout
    const handleLogout = async () => {

        try {

            await logoutAdmin();

            setAdmin(null);
            setStudents([]);
            setSelectedStudent(null);
            setMessage('');
            setError('');

        } catch (err) {

            setError(
                err.response?.data?.message ||
                'Unable to logout. Please try again.'
            );

        }

    };

    // Select student for editing
    const handleEditStudent = (student) => {

        setSelectedStudent(student);

        setMessage('');
        setError('');

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    };

    // Delete student function
    const handleDeleteStudent = async (studentId) => {

        const confirmDelete = window.confirm(
            'Are you sure you want to delete this student?'
        );

        if (!confirmDelete) {
            return;
        }

        try {

            setError('');
            setMessage('');

            const response = await deleteStudent(studentId);

            if (response.success) {

                await loadStudents();

                setMessage('Student deleted successfully!');

            } else {

                setError(response.message || 'Unable to delete student.');

            }

        } catch (err) {

            setError(
                err.response?.data?.message ||
                'Something went wrong while deleting student.'
            );

        }

    };

    // Show loading while checking admin session
    if (authLoading) {

        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center">

                <div className="text-center">

                    <div className="spinner-border text-primary"></div>

                    <p className="mt-3 text-muted">
                        Checking admin session...
                    </p>

                </div>

            </div>
        );

    }

    // Show login page if admin is not logged in
    if (!admin) {

        return (
            <Login onLoginSuccess={handleLoginSuccess} />
        );

    }

    // Admin Dashboard
    return (

        <>

            <Navbar />

            <main className="container py-4">

                {/* Dashboard Heading and Admin Info */}
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

                    <div>
                        <h2 className="fw-bold">
                            Student Management Dashboard
                        </h2>

                        <p className="text-muted mb-0">
                            Manage and organize student records easily.
                        </p>
                    </div>

                    <div className="d-flex align-items-center gap-3">

                        <div className="text-end">
                            <div className="fw-semibold">
                                {admin.name}
                            </div>

                            <small className="text-muted">
                                Administrator
                            </small>
                        </div>

                        <button
                            className="btn btn-outline-danger"
                            onClick={handleLogout}
                        >
                            <i className="bi bi-box-arrow-right me-2"></i>
                            Logout
                        </button>

                    </div>

                </div>

                {/* Dashboard Cards */}
                <div className="row g-4 mb-4">

                    {/* Total Students */}
                    <div className="col-md-4">

                        <div className="card dashboard-card student-stat-card border-0 shadow-sm h-100">

                            <div className="card-body d-flex justify-content-between align-items-center">

                                <div>
                                    <p className="text-muted mb-2">
                                        Total Students
                                    </p>

                                    <h2 className="fw-bold mb-0">
                                        {students.length}
                                    </h2>

                                    <small className="text-success">
                                        <i className="bi bi-people-fill me-1"></i>
                                        Registered Students
                                    </small>
                                </div>

                                <div className="stat-icon bg-primary-subtle text-primary">
                                    <i className="bi bi-mortarboard-fill"></i>
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Departments */}
                    <div className="col-md-4">

                        <div className="card dashboard-card student-stat-card border-0 shadow-sm h-100">

                            <div className="card-body d-flex justify-content-between align-items-center">

                                <div>
                                    <p className="text-muted mb-2">
                                        Departments
                                    </p>

                                    <h2 className="fw-bold mb-0">
                                        {[...new Set(students.map(s => s.department))].length}
                                    </h2>

                                    <small className="text-info">
                                        <i className="bi bi-building me-1"></i>
                                        Available Departments
                                    </small>
                                </div>

                                <div className="stat-icon bg-info-subtle text-info">
                                    <i className="bi bi-building-fill"></i>
                                </div>

                            </div>

                        </div>

                    </div>

                    {/* Active Records */}
                    <div className="col-md-4">

                        <div className="card dashboard-card student-stat-card border-0 shadow-sm h-100">

                            <div className="card-body d-flex justify-content-between align-items-center">

                                <div>
                                    <p className="text-muted mb-2">
                                        Active Records
                                    </p>

                                    <h2 className="fw-bold mb-0">
                                        {students.length}
                                    </h2>

                                    <small className="text-success">
                                        <i className="bi bi-check-circle-fill me-1"></i>
                                        Available Records
                                    </small>
                                </div>

                                <div className="stat-icon bg-success-subtle text-success">
                                    <i className="bi bi-clipboard-check-fill"></i>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Success Message */}
                {message && (

                    <div className="alert alert-success alert-dismissible fade show">

                        <i className="bi bi-check-circle-fill me-2"></i>

                        {message}

                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setMessage('')}
                        ></button>

                    </div>

                )}

                {/* Error Message */}
                {error && (

                    <div className="alert alert-danger">
                        {error}
                    </div>

                )}

                {/* Student Form */}
                <StudentForm
                    students={students}
                    onStudentAdded={loadStudents}
                    selectedStudent={selectedStudent}
                    onStudentUpdated={async () => {
                        await loadStudents();
                        setSelectedStudent(null);
                    }}
                    onCancelEdit={() => setSelectedStudent(null)}
                />

                {/* Student Table */}
                {loading ? (

                    <div className="text-center py-5">

                        <div className="spinner-border text-primary"></div>

                        <p className="mt-2">
                            Loading students...
                        </p>

                    </div>

                ) : (

                    <StudentTable
                        students={students}
                        onDelete={handleDeleteStudent}
                        onEdit={handleEditStudent}
                    />

                )}

            </main>

            <footer className="text-center py-3 text-muted">
                Student Records Management System © 2026
            </footer>

        </>

    );

}

export default App;
