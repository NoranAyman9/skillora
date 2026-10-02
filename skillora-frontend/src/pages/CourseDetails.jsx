import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import LessonCard from "../components/LessonCard";
import Loading from "../components/Loading";
import ProgressSection from "../components/ProgressSection";
import RatingSection from "../components/RatingSection";

const CourseDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] =
    useState({});
  const [editingComment, setEditingComment] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [enrolled, setEnrolled] =
    useState(false);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        setError("");

        const courseResponse = await api.get(
          `/courses/${id}`
        );

        const lessonsResponse = await api.get(
          `/courses/${id}/lessons`
        );

        if (!ignore) {
          setCourse(courseResponse.data);
          setLessons(lessonsResponse.data);
        }

        if (user?.role === "student") {
          try {
            const myCoursesResponse =
              await api.get(
                "/enrollments/my-courses"
              );

            if (!ignore) {
              const isEnrolled =
                myCoursesResponse.data.some(
                  (item) =>
                    item.course?._id === id ||
                    item.course === id
                );

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
              "Failed to load course"
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

  const enroll = async () => {
    try {
      setError("");
      setMessage("");

      await api.post(`/courses/${id}/enroll`);

      setEnrolled(true);

      setMessage(
        "You have successfully enrolled in this course."
      );
    } catch (error) {
      if (
        error.response?.status === 409
      ) {
        setEnrolled(true);

        setMessage(
          "You are already enrolled in this course."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Enrollment failed"
        );
      }
    }
  };

  const loadComments = async (lessonId) => {
    try {
      const response = await api.get(
        `/lessons/${lessonId}/comments`
      );

      setComments((previous) => ({
        ...previous,
        [lessonId]: response.data,
      }));
    } catch {
      setComments((previous) => ({
        ...previous,
        [lessonId]: [],
      }));
    }
  };

  const handleCommentChange = (
    lessonId,
    value
  ) => {
    setCommentInputs((previous) => ({
      ...previous,
      [lessonId]: value,
    }));
  };

  const addComment = async (lessonId) => {
    const content =
      commentInputs[lessonId]?.trim();

    if (!content) return;

    try {
      setError("");
      setMessage("");

      await api.post(
        `/lessons/${lessonId}/comments`,
        { content }
      );

      setCommentInputs((previous) => ({
        ...previous,
        [lessonId]: "",
      }));

      await loadComments(lessonId);

      setMessage(
        "Comment added successfully."
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to add comment"
      );
    }
  };

  const startEditComment = (comment) => {
    setEditingComment({
      id: comment._id,
      content: comment.content,
      lessonId: comment.lesson,
    });
  };

  const updateComment = async () => {
    if (!editingComment?.content.trim()) {
      return;
    }

    try {
      await api.put(
        `/comments/${editingComment.id}`,
        {
          content:
            editingComment.content.trim(),
        }
      );

      await loadComments(
        editingComment.lessonId
      );

      setEditingComment(null);

      setMessage(
        "Comment updated successfully."
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update comment"
      );
    }
  };

  const deleteComment = async (
    commentId,
    lessonId
  ) => {
    const confirmed = window.confirm(
      "Delete this comment?"
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/comments/${commentId}`
      );

      await loadComments(lessonId);

      setMessage(
        "Comment deleted successfully."
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete comment"
      );
    }
  };

  const deleteLesson = async (lessonId) => {
    const confirmed = window.confirm(
      "Delete this lesson?"
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/lessons/${lessonId}`
      );

      setLessons((previous) =>
        previous.filter(
          (lesson) =>
            lesson._id !== lessonId
        )
      );

      setMessage(
        "Lesson deleted successfully."
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete lesson"
      );
    }
  };

  if (loading) {
    return <Loading text="Loading course..." />;
  }

  if (!course) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error || "Course not found"}
        </div>
      </div>
    );
  }

  const isOwner =
    user?.role === "instructor" &&
    course.instructor?._id === user?.id;

  const isStudent =
    isAuthenticated &&
    user?.role === "student" &&
    enrolled;

  return (
    <div className="course-details-page">
      <div className="course-details-hero">
        <div className="container">
          <span className="course-category">
            {course.category}
          </span>

          <h1>{course.title}</h1>

          <p>{course.description}</p>

          <div className="course-meta">
            <span>
              Instructor:{" "}
              <strong>
                {course.instructor?.name}
              </strong>
            </span>

            <span>
              Price:{" "}
              <strong>
                {course.price === 0
                  ? "Free"
                  : `$${course.price}`}
              </strong>
            </span>
          </div>

          {isAuthenticated &&
            user?.role === "student" &&
            !enrolled && (
              <button
                className="btn btn-light mt-3"
                onClick={enroll}
              >
                Enroll in Course
              </button>
            )}

          {enrolled &&
            user?.role === "student" && (
              <span className="badge bg-success mt-3 p-2">
                ✓ Enrolled
              </span>
            )}

          {isOwner && (
            <>
              <Link
                to={`/courses/${id}/edit`}
                className="btn btn-outline-light mt-3 ms-2"
              >
                Edit Course
              </Link>

              <Link
                to={`/courses/${id}/lessons/create`}
                className="btn btn-light mt-3 ms-2"
              >
                + Add Lesson
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="container py-5">
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

        {isStudent && (
          <ProgressSection
            courseId={id}
            lessons={lessons}
            isStudent={isStudent}
          />
        )}

        <div className="section-heading mb-4">
          <div>
            <span className="section-label">
              COURSE CONTENT
            </span>

            <h2>Lessons</h2>
          </div>
        </div>

        {lessons.length === 0 ? (
          <div className="empty-state">
            <h4>No lessons yet</h4>

            <p>
              The instructor hasn't added lessons
              yet.
            </p>
          </div>
        ) : (
          lessons.map((lesson) => (
            <div key={lesson._id}>
              <LessonCard
                lesson={lesson}
                instructor={isOwner}
                onDelete={deleteLesson}
              />

              <div className="comments-section">
                <button
                  className="btn btn-sm btn-outline-navy mb-3"
                  onClick={() =>
                    loadComments(lesson._id)
                  }
                >
                  Show Comments
                </button>

                {comments[lesson._id] && (
                  <>
                    {comments[lesson._id].length ===
                    0 ? (
                      <p className="text-muted">
                        No comments yet.
                      </p>
                    ) : (
                      comments[
                        lesson._id
                      ].map((comment) => (
                        <div
                          className="comment-card"
                          key={comment._id}
                        >
                          <div className="comment-header">
                            <strong>
                              {comment.user?.name ||
                                "Student"}
                            </strong>

                            {user?.id ===
                              comment.user?._id && (
                              <div>
                                <button
                                  className="comment-action"
                                  onClick={() =>
                                    startEditComment(
                                      {
                                        ...comment,
                                        lesson:
                                          lesson._id,
                                      }
                                    )
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  className="comment-action danger"
                                  onClick={() =>
                                    deleteComment(
                                      comment._id,
                                      lesson._id
                                    )
                                  }
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>

                          <p>
                            {comment.content}
                          </p>
                        </div>
                      ))
                    )}
                  </>
                )}

                {isAuthenticated &&
                  user?.role === "student" &&
                  enrolled && (
                    <div className="comment-input">
                      <input
                        type="text"
                        maxLength="1000"
                        placeholder="Write a comment..."
                        value={
                          commentInputs[
                            lesson._id
                          ] || ""
                        }
                        onChange={(e) =>
                          handleCommentChange(
                            lesson._id,
                            e.target.value
                          )
                        }
                      />

                      <button
                        className="btn btn-navy"
                        onClick={() =>
                          addComment(
                            lesson._id
                          )
                        }
                      >
                        Comment
                      </button>
                    </div>
                  )}
              </div>
            </div>
          ))
        )}

        {isStudent && (
          <div className="mt-5">
            <RatingSection
              courseId={id}
            />
          </div>
        )}
      </div>

      {editingComment && (
        <div className="modal-backdrop-custom">
          <div className="edit-comment-modal">
            <h4>Edit Comment</h4>

            <textarea
              rows="4"
              maxLength="1000"
              value={editingComment.content}
              onChange={(e) =>
                setEditingComment({
                  ...editingComment,
                  content: e.target.value,
                })
              }
            />

            <div className="d-flex gap-2 mt-3">
              <button
                className="btn btn-navy"
                onClick={updateComment}
              >
                Save
              </button>

              <button
                className="btn btn-outline-secondary"
                onClick={() =>
                  setEditingComment(null)
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
