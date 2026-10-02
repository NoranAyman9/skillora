import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

const CreateCourse = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: 0,
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

    try {
      setLoading(true);
      setError("");

      const response = await api.post(
        "/courses",
        {
          ...form,
          price: Number(form.price),
        }
      );

      navigate(
        `/courses/${response.data.course._id}`
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create course"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
        <span className="section-label">
          INSTRUCTOR
        </span>

        <h1>Create Course</h1>

        <p className="form-subtitle">
          Create a new learning experience for
          students.
        </p>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="main-form"
        >
          <div className="form-group">
            <label>Course Title</label>

            <input
              name="title"
              placeholder="e.g. React Fundamentals"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              rows="5"
              placeholder="Describe your course..."
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>

              <input
                name="category"
                placeholder="e.g. Programming"
                value={form.category}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Price</label>

              <input
                type="number"
                min="0"
                name="price"
                value={form.price}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline-navy"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>

            <button
              className="btn btn-navy"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;