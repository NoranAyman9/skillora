import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../services/api";
import Loading from "../components/Loading";

const EditLesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    videoUrl: "",
    order: 1,
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await api.get(
          `/lessons/${id}`
        );

        const data = response.data;

        setLesson(data);

        setForm({
          title: data.title,
          content: data.content,
          videoUrl: data.videoUrl || "",
          order: data.order,
        });
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load lesson"
        );
      }
    };

    fetchLesson();
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

      await api.put(`/lessons/${id}`, {
        title: form.title,
        content: form.content,
        videoUrl: form.videoUrl,
        order: Number(form.order),
      });

      navigate(
        `/courses/${lesson.course._id}`
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update lesson"
      );
    } finally {
      setSaving(false);
    }
  };

  if (!lesson) {
    return error ? (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    ) : (
      <Loading text="Loading lesson..." />
    );
  }

  return (
    <div className="form-page">
      <div className="form-container">
        <span className="section-label">
          COURSE CONTENT
        </span>

        <h1>Edit Lesson</h1>

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
            <label>Lesson Title</label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Content</label>

            <textarea
              name="content"
              rows="6"
              value={form.content}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Video URL</label>

              <input
                name="videoUrl"
                value={form.videoUrl}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Order</label>

              <input
                type="number"
                min="1"
                name="order"
                value={form.order}
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

export default EditLesson;