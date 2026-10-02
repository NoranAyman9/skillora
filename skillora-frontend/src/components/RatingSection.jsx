import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const RatingSection = ({ courseId }) => {
  const { user, isAuthenticated } = useAuth();

  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchRatings = async () => {
      try {
        setError("");

        const response = await api.get(
          `/courses/${courseId}/ratings`
        );

        const data = response.data;

        const ratingsData = Array.isArray(data)
          ? data
          : data.ratings || [];

        let average = data.averageRating;

        if (
          average === undefined &&
          ratingsData.length > 0
        ) {
          const total = ratingsData.reduce(
            (sum, item) =>
              sum + Number(item.rating || 0),
            0
          );

          average = total / ratingsData.length;
        }

        if (average === undefined) {
          average = 0;
        }

        if (!ignore) {
          setRatings(ratingsData);
          setAverageRating(Number(average));
        }
      } catch (error) {
        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Failed to load ratings"
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchRatings();

    return () => {
      ignore = true;
    };
  }, [courseId]);

  const loadRatings = async () => {
    try {
      setError("");

      const response = await api.get(
        `/courses/${courseId}/ratings`
      );

      const data = response.data;

      const ratingsData = Array.isArray(data)
        ? data
        : data.ratings || [];

      let average = data.averageRating;

      if (
        average === undefined &&
        ratingsData.length > 0
      ) {
        const total = ratingsData.reduce(
          (sum, item) =>
            sum + Number(item.rating || 0),
          0
        );

        average = total / ratingsData.length;
      }

      if (average === undefined) {
        average = 0;
      }

      setRatings(ratingsData);
      setAverageRating(Number(average));
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load ratings"
      );
    }
  };

  const submitRating = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      await api.post(`/courses/${courseId}/ratings`, {
        rating: Number(rating),
        review: review.trim(),
      });

      setReview("");
      setRating(5);

      setMessage(
        "Rating submitted successfully."
      );

      await loadRatings();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to submit rating"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteRating = async (ratingId) => {
    try {
      setError("");
      setMessage("");

      await api.delete(`/ratings/${ratingId}`);

      setMessage(
        "Rating deleted successfully."
      );

      await loadRatings();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete rating"
      );
    }
  };

  const userRating = ratings.find((item) => {
    const ratingUserId =
      item.user?._id || item.user;

    return (
      ratingUserId?.toString() ===
      user?.id?.toString()
    );
  });

  if (loading) {
    return (
      <div className="card shadow-sm mb-5">
        <div className="card-body">
          <p className="mb-0">
            Loading ratings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm mb-5">
      <div className="card-body p-4">
        <h2 className="fw-bold mb-3">
          Course Ratings
        </h2>

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

        <div className="mb-4">
          <h4>
            Average Rating:{" "}
            {averageRating.toFixed(1)} ⭐
          </h4>

          <p className="text-muted">
            {ratings.length}{" "}
            {ratings.length === 1
              ? "rating"
              : "ratings"}
          </p>
        </div>

        {isAuthenticated &&
          user?.role === "student" && (
            <div className="border rounded p-3 mb-4">
              <h5 className="fw-bold mb-3">
                {userRating
                  ? "Your Rating"
                  : "Rate This Course"}
              </h5>

              <form onSubmit={submitRating}>
                <div className="mb-3">
                  <label className="form-label">
                    Rating
                  </label>

                  <select
                    className="form-select"
                    value={rating}
                    onChange={(e) =>
                      setRating(e.target.value)
                    }
                  >
                    <option value="5">
                      5 ⭐
                    </option>

                    <option value="4">
                      4 ⭐
                    </option>

                    <option value="3">
                      3 ⭐
                    </option>

                    <option value="2">
                      2 ⭐
                    </option>

                    <option value="1">
                      1 ⭐
                    </option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Review
                  </label>

                  <textarea
                    className="form-control"
                    rows="3"
                    value={review}
                    onChange={(e) =>
                      setReview(e.target.value)
                    }
                    placeholder="Write your review..."
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting
                    ? "Submitting..."
                    : userRating
                    ? "Update Rating"
                    : "Submit Rating"}
                </button>
              </form>
            </div>
          )}

        <div>
          <h5 className="fw-bold mb-3">
            Reviews
          </h5>

          {ratings.length === 0 ? (
            <p className="text-muted">
              No ratings yet.
            </p>
          ) : (
            ratings.map((item) => {
              const ratingUserId =
                item.user?._id || item.user;

              const isMyRating =
                ratingUserId?.toString() ===
                user?.id?.toString();

              return (
                <div
                  key={item._id}
                  className="border rounded p-3 mb-3"
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>
                        {item.user?.name ||
                          "User"}
                      </strong>

                      <div className="mt-1">
                        {"⭐".repeat(
                          Number(item.rating) || 0
                        )}
                      </div>
                    </div>

                    {isMyRating && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() =>
                          deleteRating(item._id)
                        }
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  {item.review && (
                    <p className="mb-0 mt-2">
                      {item.review}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingSection;
