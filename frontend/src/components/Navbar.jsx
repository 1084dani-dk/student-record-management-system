
function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark sr-navbar shadow-sm">
            <div className="container">

                <a className="navbar-brand fw-bold d-flex align-items-center" href="/">
                    <span className="sr-brand-icon me-2">
                        <i className="bi bi-mortarboard-fill"></i>
                    </span>

                    <span>Student Records System</span>
                </a>

                <div className="d-flex align-items-center">
                    <span className="sr-admin-badge">
                        <i className="bi bi-person-circle me-2"></i>
                        Admin Dashboard
                    </span>
                </div>

            </div>
        </nav>
    );
}

export default Navbar;
