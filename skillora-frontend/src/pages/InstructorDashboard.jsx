import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import ProgressSection from "../components/ProgressSection";
import RatingSection from "../components/RatingSection";

const CourseDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [editingComment, setEditingComment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        setError("");

        const courseResponse = await api.get(`/courses/${id}`);
        const lessonsResponse = await api.get(
          `/courses/${id}/lessons`
        );

        if (!ignore) {
          setCourse(courseResponse.data);
          setLessons(lessonsResponse.data);
        }

        if (user?.role === "student") {
          try {
            const enrollmentResponse = await api.get(
              "/enrollments/my-courses"
            );

            if (!ignore) {
              const isEnrolled =
                enrollmentResponse.data.some((item) => {
                  const courseId =
                    item.course?._id || item.course;

                  return (
                    courseId?.toString() === id?.toString()
                  );
                });

              setEnrolled(isEnrolled);
            }
          } catch {
            if (!ignore) {
              setEnrolled(false);
            }
          }
        }
      } catch (error) {
        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Failed to load course details"
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [id, user?.role]);

  const handleEnroll = async () => {
    try {
      setMessage("");
      setError("");

      await api.post(`/courses/${id}/enroll`);

      setEnrolled(true);
      setMessage("You enrolled in this course successfully.");
    } catch (error) {
      if (error.response?.status === 409) {
        setEnrolled(true);
        setMessage("You are already enrolled in this course.");
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to enroll in course"
        );
      }
    }
  };

  const loadComments = async (lessonId) => {
    try {
      const response = await api.get(
        `/lessons/${lessonId}/comments`
      );

      setComments((prev) => ({
        ...prev,
        [lessonId]: response.data,
      }));
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load comments"
      );
    }
  };

  const handleCommentChange = (lessonId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [lessonId]: value,
    }));
  };

  const handleAddComment = async (lessonId) => {
    const content = commentInputs[lessonId]?.trim();

    if (!content) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      setError("");
      setMessage("");

      await api.post(`/lessons/${lessonId}/comments`, {
        content,
      });

      setCommentInputs((prev) => ({
        ...prev,
        [lessonId]: "",
      }));

      setMessage("Comment added successfully.");

      await loadComments(lessonId);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to add comment"
      );
    }
  };

  const startEditComment = (comment) => {
    setEditingComment(comment._id);

    setCommentInputs((prev) => ({
      ...prev,
      [comment.lesson]: comment.content,
    }));
  };

  const handleUpdateComment = async (comment) => {
    const content = commentInputs[comment.lesson]?.trim();

    if (!content) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      setError("");
      setMessage("");

      await api.put(`/comments/${comment._id}`, {
        content,
      });

      setEditingComment(null);

      setCommentInputs((prev) => ({
        ...prev,
        [comment.lesson]: "",
      }));

      setMessage("Comment updated successfully.");

      await loadComments(comment.lesson);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update comment"
      );
    }
  };

  const handleDeleteComment = async (comment) => {
    try {
      setError("");
      setMessage("");

      await api.delete(`/comments/${comment._id}`);

      setMessage("Comment deleted successfully.");

      await loadComments(comment.lesson);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete comment"
      );
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lesson?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await api.delete(`/lessons/${lessonId}`);

      setLessons((prev) =>
        prev.filter((lesson) => lesson._id !== lessonId)
      );

      setMessage("Lesson deleted successfully.");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete lesson"
      );
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error && !course) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Course not found.
        </div>
      </div>
    );
  }

  const isOwner =
    user?.role === "instructor" &&
    course.instructor?._id === user?.id;

  return (
    <div className="container py-5">
      <div className="mb-4">
        <Link
          to="/courses"
          className="btn btn-outline-secondary"
        >
          ← Back to Courses
        </Link>
      </div>

      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="card shadow-sm mb-5">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start gap-3">
            <div>
              <h1 className="fw-bold mb-3">
                {course.title}
              </h1>

              <p className="text-muted mb-2">
                {course.description}
              </p>

              <p className="mb-2">
                <strong>Category:</strong>{" "}
                {course.category}
              </p>

              <p className="mb-2">
                <strong>Price:</strong>{" "}
                {course.price ?? 0}
              </p>

              <p className="mb-0">
                <strong>Instructor:</strong>{" "}
                {course.instructor?.name ||
                  "Unknown Instructor"}
              </p>
            </div>

            <div>
              {isAuthenticated &&
                user?.role === "student" &&
                !enrolled && (
                  <button
                    className="btn btn-primary"
                    onClick={handleEnroll}
                  >
                    Enroll Now
                  </button>
                )}

              {enrolled && (
                <span className="badge bg-success fs-6">
                  Enrolled
                </span>
              )}
            </div>
          </div>

          {isOwner && (
            <div className="mt-4 d-flex gap-2 flex-wrap">
              <Link
                to={`/courses/${id}/edit`}
                className="btn btn-warning"
              >
                Edit Course
              </Link>

              <Link
                to={`/courses/${id}/lessons/new`}
                className="btn btn-success"
              >
                Add Lesson
              </Link>
            </div>
          )}
        </div>
      </div>

      {user?.role === "student" && (
        <ProgressSection
          courseId={id}
          lessons={lessons}
          isStudent={user?.role === "student" && enrolled}
        />
      )}

      <RatingSection courseId={id} />

      <div className="mb-5">
        <h2 className="fw-bold mb-4">
          Course Lessons
        </h2>

        {lessons.length === 0 ? (
          <div className="alert alert-info">
            No lessons available for this course yet.
          </div>
        ) : (
          lessons.map((lesson) => (
            <div
              key={lesson._id}
              className="card shadow-sm mb-4"
            >
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h4 className="fw-bold">
                      {lesson.order}. {lesson.title}
                    </h4>

                    <p className="text-muted">
                      {lesson.content}
                    </p>
                  </div>

                  {isOwner && (
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() =>
                        handleDeleteLesson(lesson._id)
                      }
                    >
                      Delete
                    </button>
                  )}
                </div>

                <hr />

                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">
                      Comments
                    </h5>

                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        loadComments(lesson._id)
                      }
                    >
                      Load Comments
                    </button>
                  </div>

                  {comments[lesson._id]?.length > 0 ? (
                    comments[lesson._id].map((comment) => (
                      <div
                        key={comment._id}
                        className="border rounded p-3 mb-2"
                      >
                        <div className="d-flex justify-content-between">
                          <strong>
                            {comment.user?.name ||
                              "User"}
                          </strong>

                          {user?.id ===
                            comment.user?._id && (
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-outline-warning"
                                onClick={() =>
                                  startEditComment(
                                    comment
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  handleDeleteComment(
                                    comment
                                  )
                                }
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>

                        {editingComment === comment._id ? (
                          <div className="mt-2">
                            <textarea
                              className="form-control mb-2"
                              rows="2"
                              value={
                                commentInputs[
                                  comment.lesson
                                ] || ""
                              }
                              onChange={(e) =>
                                handleCommentChange(
                                  comment.lesson,
                                  e.target.value
                                )
                              }
                            />

                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() =>
                                  handleUpdateComment(
                                    comment
                                  )
                                }
                              >
                                Save
                              </button>

                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={() =>
                                  setEditingComment(null)
                                }
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="mb-0 mt-2">
                            {comment.content}
                          </p>
                        )}
                      </div>
                    ))
                  ) : comments[lesson._id] ? (
                    <p className="text-muted">
                      No comments yet.
                    </p>
                  ) : null}

                  {isAuthenticated && (
                    <div className="mt-3">
                      <textarea
                        className="form-control mb-2"
                        rows="2"
                        placeholder="Write a comment..."
                        value={
                          commentInputs[lesson._id] || ""
                        }
                        onChange={(e) =>
                          handleCommentChange(
                            lesson._id,
                            e.target.value
                          )
                        }
                      />

                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          handleAddComment(lesson._id)
                        }
                      >
                        Add Comment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
