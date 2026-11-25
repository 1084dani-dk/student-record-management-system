
import axios from 'axios';

const API_URL = 'http://localhost/student-api/api';

// Add Student API
export const addStudent = async (studentData) => {
    const response = await axios.post(
        `${API_URL}/add_student.php`,
        studentData,
        { withCredentials: true }
    );

    return response.data;
};

// Get Students API
export const getStudents = async () => {
    const response = await axios.get(
        `${API_URL}/get_students.php`,
        { withCredentials: true }
    );

    return response.data;
};

// Delete Student API
export const deleteStudent = async (studentId) => {
    const response = await axios.delete(
        `${API_URL}/delete_student.php`,
        {
            data: { id: studentId },
            withCredentials: true
        }
    );

    return response.data;
};

// Update Student API
export const updateStudent = async (studentData) => {
    const response = await axios.put(
        `${API_URL}/update_student.php`,
        studentData,
        { withCredentials: true }
    );

    return response.data;
};
