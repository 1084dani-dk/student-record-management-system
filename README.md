# Student Records Management System

A web-based Student Records Management System built using React.js, PHP, and MySQL. This application allows administrators to securely manage student records through an interactive dashboard.

## Features

### Student Management
- Add new student records
- View all student records
- Update existing student information
- Delete student records
- Search and sort student records
- Pagination
- Client-side and server-side validation
- Duplicate Roll Number and Email validation
- Email and phone number validation
- Success and error notifications

### Data Export
- Copy records
- Export CSV
- Export Excel
- Export PDF
- Print records

### Admin Authentication
- Admin login and logout
- PHP session-based authentication
- Protected student APIs
- Password hashing using PHP `password_hash()`
- Password verification using `password_verify()`
- Unauthorized users cannot access student records
- Admin registration disabled after initial setup

### User Interface
- Responsive dashboard
- Bootstrap 5 styling
- DataTables integration
- Admin dashboard statistics

## Technologies Used

### Frontend
- HTML5
- CSS3
- Bootstrap 5
- JavaScript
- React.js
- Axios
- jQuery
- DataTables

### Backend
- PHP
- PDO
- MySQL
- PHP Sessions

### Development Tools
- Visual Studio Code
- XAMPP
- Postman
- Git
- GitHub
- Vite

## Project Structure

```text
student-record-system/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── StudentForm.jsx
│   │   │   ├── StudentTable.jsx
│   │   │   └── Message.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── studentService.js
│   │   │   └── authService.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── database.php
│   │
│   ├── api/
│   │   ├── test.php
│   │   ├── add_student.php
│   │   ├── get_students.php
│   │   ├── update_student.php
│   │   ├── delete_student.php
│   │   ├── login.php
│   │   ├── logout.php
│   │   ├── check_auth.php
│   │   └── create_admin.php
│   │
│   ├── helpers/
│   │   └── auth.php
│   │
│   └── database.sql (if provided)
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL

cd student-record-system
```

### 2. Install Frontend Dependencies

```bash
cd frontend

npm install
```

### 3. Database Setup

1. Start Apache and MySQL using XAMPP.
2. Open phpMyAdmin.
3. Create a database named `student_records`.
4. Create the required `students` and `admins` tables according to the application schema.

### 4. Backend Configuration

Configure database credentials in:

`backend/config/database.php`

Make sure the backend is accessible through Apache.

For the local development setup, the API is configured at:

`http://localhost/student-api/api/`

### 5. Admin Setup

Create the initial admin account using a secure local setup process.

- Store admin passwords as password hashes.
- Never store plain-text passwords.
- The `create_admin.php` registration endpoint is disabled after initial admin creation.

### 6. Run Frontend

```bash
cd frontend

npm run dev
```

Open the URL shown in the terminal, usually:

`http://localhost:5173/`

## API Endpoints

Base URL:

`http://localhost/student-api/api/`

| Method | Endpoint | Purpose |
|---|---|---|
| POST | add_student.php | Add student |
| GET | get_students.php | Fetch student records |
| PUT | update_student.php | Update student |
| DELETE | delete_student.php | Delete student |
| POST | login.php | Admin login |
| POST | logout.php | Admin logout |
| GET | check_auth.php | Check admin session |
| POST | create_admin.php | Initial admin registration (disabled) |

Student management endpoints require an authenticated admin session.

## Database

Database name: `student_records`

### Students Table

- id
- name
- roll_no
- email
- phone
- department
- semester
- created_at

### Admins Table

- id
- name
- email
- password
- created_at

Admin passwords are stored as secure password hashes.

## Security

- Session-based admin authentication
- Protected student management APIs
- Prepared SQL statements using PDO
- Server-side input validation
- Password hashing
- CORS configuration
- Sensitive database configuration excluded through `.gitignore`

## Project Team

- Team Member 1: M. Danish Hamad
- Team Member 2: Maarij Azhar

## Project Status

Core student management functionality and admin authentication have been implemented and tested locally.

The project is being prepared for GitHub publication and online deployment.

## Future Improvements

- Online hosting and deployment
- Improved admin account management
- Additional security enhancements
- Better dashboard analytics
