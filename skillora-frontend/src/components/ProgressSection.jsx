import { useEffect, useState } from "react";
import api from "../services/api";

const ProgressSection = ({
  courseId,
  lessons,
  isStudent,
}) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingLesson, setUpdatingLesson] =
    useState(null);

  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadProgress = async () => {
      if (!isStudent) {
        if (!ignore) {
          setLoading(false);
        }

        return;
      }

      try {
        setError("");

        const response = await api.get(
          `/courses/${courseId}/progress`
        );

        if (!ignore) {
          setProgress(response.data);
        }
      } catch (error) {
        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "You need to enroll in this course to track progress."
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadProgress();

    return () => {
      ignore = true;
    };
  }, [courseId, isStudent]);

  const getLessonProgress = (lessonId) => {
    if (!progress?.lessons) {
      return null;
    }

    return progress.lessons.find((item) => {
      const itemLessonId =
        item.lesson?._id ||
        item.lesson ||
        item.lessonId;

      return (
        itemLessonId?.toString() ===
        lessonId?.toString()
      );
    });
  };

  const toggleComplete = async (
    lessonId,
    currentCompleted
  ) => {
    try {
      setUpdatingLesson(lessonId);
      setError("");

      await api.put(
        `/lessons/${lessonId}/progress`,
        {
          completed: !currentCompleted,
          progressPercentage:
            !currentCompleted ? 100 : 0,
        }
      );

      const response = await api.get(
        `/courses/${courseId}/progress`
      );

      setProgress(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update progress"
      );
    } finally {
      setUpdatingLesson(null);
    }
  };

  if (!isStudent) {
    return null;
  }

  if (loading) {
    return (
      <div className="progress-section mb-5">
        <div className="card shadow-sm">
          <div className="card-body">
            <p className="mb-0">
              Loading your progress...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-section mb-5">
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h2 className="fw-bold mb-3">
            Your Progress
          </h2>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {progress && (
            <>
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <span className="fw-bold">
                    Overall Progress
                  </span>

                  <span>
                    {progress.progressPercentage ?? 0}%
                  </span>
                </div>

                <div
                  className="progress"
                  style={{ height: "10px" }}
                >
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${
                        progress.progressPercentage ?? 0
                      }%`,
                    }}
                    aria-valuenow={
                      progress.progressPercentage ?? 0
                    }
                    aria-valuemin="0"
                    aria-valuemax="100"
                  />
                </div>
              </div>

              <h5 className="fw-bold mb-3">
                Lesson Progress
              </h5>

              {lessons.length === 0 ? (
                <p className="text-muted">
                  No lessons available.
                </p>
              ) : (
                lessons.map((lesson) => {
                  const lessonProgress =
                    getLessonProgress(lesson._id);

                  const completed =
                    lessonProgress?.completed || false;

                  const percentage =
                    lessonProgress?.progressPercentage ??
                    (completed ? 100 : 0);

                  const isUpdating =
                    updatingLesson === lesson._id;

                  return (
                    <div
                      key={lesson._id}
                      className="border rounded p-3 mb-3"
                    >
                      <div className="d-flex justify-content-between align-items-center gap-3">
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between mb-2">
                            <strong>
                              {lesson.order}.{" "}
                              {lesson.title}
                            </strong>

                            <span>
                              {percentage}%
                            </span>
                          </div>

                          <div
                            className="progress"
                            style={{
                              height: "8px",
                            }}
                          >
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{
                                width: `${percentage}%`,
                              }}
                              aria-valuenow={
                                percentage
                              }
                              aria-valuemin="0"
                              aria-valuemax="100"
                            />
                          </div>
                        </div>

                        <button
                          className={`btn ${
                            completed
                              ? "btn-success"
                              : "btn-outline-primary"
                          }`}
                          disabled={isUpdating}
                          onClick={() =>
                            toggleComplete(
                              lesson._id,
                              completed
                            )
                          }
                        >
                          {isUpdating
                            ? "Updating..."
                            : completed
                            ? "✓ Completed"
                            : "Mark Complete"}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {!progress && !error && (
            <p className="text-muted">
              No progress data available yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressSection;
