import { Link } from "react-router-dom";

const LessonCard = ({
  lesson,
  instructor,
  onDelete,
}) => {
  return (
    <div className="lesson-card">
      <div className="lesson-number">
        {lesson.order}
      </div>

      <div className="lesson-content">
        <h5>{lesson.title}</h5>

        <p>{lesson.content}</p>

        {lesson.videoUrl && (
          <a
            href={lesson.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="lesson-video"
          >
            Watch Video →
          </a>
        )}

        {instructor && (
          <div className="lesson-actions mt-3">
            <Link
              to={`/lessons/${lesson._id}/edit`}
              className="btn btn-sm btn-outline-navy"
            >
              Edit
            </Link>

            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() =>
                onDelete(lesson._id)
              }
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonCard;