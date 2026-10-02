import { useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import api from "../services/api";

const CreateLesson = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    videoUrl: "",
    order: 1,
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        `/courses/${courseId}/lessons`,
        {
          ...form,
          order: Number(form.order),
        }
      );

      navigate(`/courses/${courseId}`);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create lesson"
      );
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <h1 className="mb-4">
            Create Lesson
          </h1>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="card shadow p-4"
          >
            <div className="mb-3">
              <label className="form-label">
                Lesson Title
              </label>

              <input
                name="title"
                className="form-control"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Content
              </label>

              <textarea
                name="content"
                className="form-control"
                rows="6"
                value={form.content}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Video URL
              </label>

              <input
                name="videoUrl"
                className="form-control"
                value={form.videoUrl}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Order
              </label>

              <input
                type="number"
                min="1"
                name="order"
                className="form-control"
                value={form.order}
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn btn-success">
              Create Lesson
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateLesson;