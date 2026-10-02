import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg skillora-navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Skillora
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarContent"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Courses
              </Link>
            </li>

            {user?.role === "student" && (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/my-courses"
                >
                  My Courses
                </Link>
              </li>
            )}

            {user?.role === "instructor" && (
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/instructor/dashboard"
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="profile-link"
                >
                  <span className="user-avatar">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>

                  <span className="user-name">
                    {user?.name}
                  </span>
                </Link>

                <button
                  className="btn btn-light btn-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  className="btn btn-outline-light btn-sm"
                  to="/login"
                >
                  Login
                </Link>

                <Link
                  className="btn btn-light btn-sm"
                  to="/register"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;