import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../services/api";
import Loading from "../components/Loading";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: 0,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(
          `/courses/${id}`
        );

        const course = response.data;

        setForm({
          title: course.title,
          description: course.description,
          category: course.category,
          price: course.price,
        });
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load course"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await api.put(`/courses/${id}`, {
        ...form,
        price: Number(form.price),
      });

      navigate(`/courses/${id}`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update course"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading text="Loading course..." />;
  }

  return (
    <div className="form-page">
      <div className="form-container">
        <span className="section-label">
          INSTRUCTOR
        </span>

        <h1>Edit Course</h1>

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
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourse;