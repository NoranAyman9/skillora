import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import Loading from "../components/Loading";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [progressMap, setProgressMap] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get(
          "/enrollments/my-courses"
        );

        const enrolledCourses =
          response.data;

        setCourses(enrolledCourses);

        const progressResults = await Promise.all(
          enrolledCourses.map(async (item) => {
            const courseId =
              item.course?._id;

            if (!courseId) {
              return null;
            }

            try {
              const progressResponse =
                await api.get(
                  `/courses/${courseId}/progress`
                );

              return {
                courseId,
                progress:
                  progressResponse.data,
              };
            } catch {
              return {
                courseId,
                progress: null,
              };
            }
          })
        );

        const mappedProgress = {};

        progressResults.forEach((item) => {
          if (item?.courseId) {
            mappedProgress[item.courseId] =
              item.progress;
          }
        });

        setProgressMap(mappedProgress);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load your courses"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <Loading text="Loading your courses..." />
    );
  }

  return (
    <div className="container py-5">
      <div className="section-heading mb-4">
        <div>
          <span className="section-label">
            STUDENT AREA
          </span>

          <h2>My Courses</h2>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {courses.length === 0 ? (
        <div className="empty-state">
          <h4>No courses yet</h4>

          <p>
            Start learning by enrolling in a
            course.
          </p>

          <Link
            to="/"
            className="btn btn-navy"
          >
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {courses.map((item) => {
            const course = item.course;

            const progress =
              progressMap[course?._id];

            const percentage =
              progress?.overallPercentage || 0;

            return (
              <div
                className="col-md-6 col-lg-4"
                key={item._id}
              >
                <div className="course-card h-100">
                  <div className="course-card-body">
                    <span className="course-category">
                      {course?.category}
                    </span>

                    <h4>
                      {course?.title}
                    </h4>

                    <p>
                      {course?.description}
                    </p>

                    <p className="text-muted">
                      Instructor:{" "}
                      {course?.instructor?.name}
                    </p>

                    <div className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <small>
                          Progress
                        </small>

                        <small>
                          {percentage}%
                        </small>
                      </div>

                      <div className="progress">
                        <div
                          className="progress-bar"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>

                    <Link
                      to={`/courses/${course?._id}`}
                      className="btn btn-navy w-100"
                    >
                      Continue Learning
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyCourses;