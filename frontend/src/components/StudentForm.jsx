
import { useState, useEffect } from 'react';
import { addStudent, updateStudent } from '../services/studentService';
import Message from './Message';

function StudentForm({
    students,
    onStudentAdded,
    selectedStudent,
    onStudentUpdated,
    onCancelEdit
}) {
    const initialFormData = {
        name: '',
        roll_no: '',
        email: '',
        phone: '',
        department: '',
        semester: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [loading, setLoading] = useState(false);

    // Load selected student data into form
    useEffect(() => {
        if (selectedStudent) {
            setFormData({
                name: selectedStudent.name ?? '',
                roll_no: selectedStudent.roll_no ?? '',
                email: selectedStudent.email ?? '',
                phone: selectedStudent.phone ?? '',
                department: selectedStudent.department ?? '',
                semester: String(selectedStudent.semester ?? '')
            });

            setMessage('');
        } else {
            setFormData(initialFormData);
        }
    }, [selectedStudent]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage('');

        const {
            name,
            roll_no,
            email,
            phone,
            department,
            semester
        } = formData;

        // Required field validation
        if (
            !name.trim() ||
            !roll_no.trim() ||
            !email.trim() ||
            !phone.trim() ||
            !department ||
            !semester
        ) {
            setMessageType('danger');
            setMessage('All fields are required.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {
            setMessageType('danger');
            setMessage('Please enter a valid email address.');
            return;
        }

        // Phone validation
        const phoneRegex = /^\+?[0-9\s()-]{7,20}$/;

        if (!phoneRegex.test(phone.trim())) {
            setMessageType('danger');
            setMessage('Please enter a valid phone number.');
            return;
        }

        // Semester validation
        const semesterNumber = Number(semester);

        if (
            !Number.isInteger(semesterNumber) ||
            semesterNumber < 1 ||
            semesterNumber > 12
        ) {
            setMessageType('danger');
            setMessage('Semester must be between 1 and 12.');
            return;
        }

        // Duplicate Roll Number validation
        const duplicateRoll = students.some(student =>
            Number(student.id) !== Number(selectedStudent?.id) &&
            student.roll_no.toLowerCase() === roll_no.trim().toLowerCase()
        );

        if (duplicateRoll) {
            setMessageType('danger');
            setMessage('This Roll Number already exists.');
            return;
        }

        // Duplicate Email validation
        const duplicateEmail = students.some(student =>
            Number(student.id) !== Number(selectedStudent?.id) &&
            student.email.toLowerCase() === email.trim().toLowerCase()
        );

        if (duplicateEmail) {
            setMessageType('danger');
            setMessage('This Email already exists.');
            return;
        }

        try {
            setLoading(true);

            let response;

            if (selectedStudent) {
                // Update existing student
                response = await updateStudent({
                    id: selectedStudent.id,
                    ...formData,
                    semester: semesterNumber
                });
            } else {
                // Add new student
                response = await addStudent({
                    ...formData,
                    semester: semesterNumber
                });
            }

            if (response.success) {
                setMessageType('success');
                setMessage(response.message);

                setFormData(initialFormData);

                if (selectedStudent) {
                    await onStudentUpdated();
                } else {
                    await onStudentAdded();
                }
            } else {
                setMessageType('danger');
                setMessage(response.message || 'Something went wrong.');
            }

        } catch (error) {
            setMessageType('danger');

            setMessage(
                error.response?.data?.message ||
                'Server error. Please try again.'
            );

        } finally {
            setLoading(false);
        }
    };

    // Reset form or cancel editing
    const handleReset = () => {
        setFormData(initialFormData);
        setMessage('');

        if (selectedStudent) {
            onCancelEdit();
        }
    };

    return (
        <div className="card shadow-sm border-0 mb-4">

            <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold">
                    <i className={`bi ${selectedStudent ? 'bi-pencil-square' : 'bi-person-plus'} me-2`}></i>
                    {selectedStudent ? 'Edit Student' : 'Add New Student'}
                </h5>

                <small className="text-muted">
                    {selectedStudent
                        ? 'Update student information below.'
                        : 'Enter student information below.'}
                </small>
            </div>

            <div className="card-body">

                {message && (
                    <Message
                        type={messageType}
                        message={message}
                    />
                )}

                <form onSubmit={handleSubmit}>

                    <div className="row">

                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                Student Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="Enter student name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                Roll Number
                            </label>

                            <input
                                type="text"
                                name="roll_no"
                                className="form-control"
                                placeholder="Enter roll number"
                                value={formData.roll_no}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                placeholder="Enter email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                Phone Number
                            </label>

                            <input
                                type="text"
                                name="phone"
                                className="form-control"
                                placeholder="Enter phone number"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                Department
                            </label>

                            <select
                                name="department"
                                className="form-select"
                                value={formData.department}
                                onChange={handleChange}
                            >
                                <option value="">Select Department</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Software Engineering">Software Engineering</option>
                                <option value="Information Technology">Information Technology</option>
                                <option value="Electrical Engineering">Electrical Engineering</option>
                                <option value="Business Administration">Business Administration</option>
                            </select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="form-label">
                                Semester
                            </label>

                            <select
                                name="semester"
                                className="form-select"
                                value={formData.semester}
                                onChange={handleChange}
                            >
                                <option value="">Select Semester</option>

                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                                    <option key={num} value={num}>
                                        Semester {num}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    <div className="d-flex gap-2 mt-2">

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    {selectedStudent ? 'Updating...' : 'Saving...'}
                                </>
                            ) : (
                                <>
                                    <i className={`bi ${selectedStudent ? 'bi-check-circle' : 'bi-plus-circle'} me-2`}></i>
                                    {selectedStudent ? 'Update Student' : 'Add Student'}
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleReset}
                            disabled={loading}
                        >
                            {selectedStudent ? 'Cancel Edit' : 'Reset'}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
}

export default StudentForm;
