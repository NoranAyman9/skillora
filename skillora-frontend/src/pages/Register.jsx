import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    instructorSecret: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      form.role === "instructor" &&
      !form.instructorSecret.trim()
    ) {
      setError("Instructor secret is required.");
      return;
    }

    try {
      setLoading(true);

      const data = await register(
        form.name,
        form.email,
        form.password,
        form.role,
        form.instructorSecret
      );

      if (data.user.role === "instructor") {
        navigate("/instructor/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">
                Create Account
              </h2>

              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    minLength="6"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Account Type
                  </label>

                  <select
                    name="role"
                    className="form-select"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="student">
                      Student
                    </option>

                    <option value="instructor">
                      Instructor
                    </option>
                  </select>
                </div>

                {form.role === "instructor" && (
                  <div className="mb-3">
                    <label className="form-label">
                      Instructor Secret
                    </label>

                    <input
                      type="password"
                      name="instructorSecret"
                      className="form-control"
                      placeholder="Enter instructor secret"
                      value={form.instructorSecret}
                      onChange={handleChange}
                      required
                    />

                    <small className="text-muted">
                      An instructor secret is required
                      to create an instructor account.
                    </small>
                  </div>
                )}

                <button
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading
                    ? "Creating account..."
                    : "Register"}
                </button>
              </form>

              <p className="text-center mt-3">
                Already have an account?{" "}
                <Link to="/login">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;