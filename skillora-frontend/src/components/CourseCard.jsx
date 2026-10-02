import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  return (
    <div className="course-card">
      <div className="course-card-top">
        <span className="course-category">
          {course.category}
        </span>

        <span className="course-price">
          {course.price === 0
            ? "Free"
            : `$${course.price}`}
        </span>
      </div>

      <div className="course-card-body">
        <h4>{course.title}</h4>

        <p className="course-description">
          {course.description}
        </p>

        <div className="instructor-info">
          <div className="mini-avatar">
            {course.instructor?.name
              ?.charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <small>Instructor</small>

            <strong>
              {course.instructor?.name || "Unknown"}
            </strong>
          </div>
        </div>

        <Link
          to={`/courses/${course._id}`}
          className="btn btn-navy w-100 mt-3"
        >
          View Course
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;