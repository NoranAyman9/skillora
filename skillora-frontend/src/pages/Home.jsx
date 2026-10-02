import { useEffect, useState } from "react";
import api from "../services/api";
import CourseCard from "../components/CourseCard";
import Loading from "../components/Loading";

const Home = () => {
  const [courses, setCourses] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchCourses = async () => {
      try {
        setError("");

        const response = await api.get("/courses", {
          params: {
            search: search || undefined,
            category: category || undefined,
            page,
            limit: 6,
          },
        });

        if (!ignore) {
          setCourses(response.data.courses);
          setPages(response.data.pages || 1);
          setLoading(false);
        }
      } catch (error) {
        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Failed to load courses"
          );
          setLoading(false);
        }
      }
    };

    fetchCourses();

    return () => {
      ignore = true;
    };
  }, [page, search, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div>
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <span className="hero-badge">
              LEARN • BUILD • GROW
            </span>

            <h1>
              Learn Skills That
              <br />
              <span>Move You Forward.</span>
            </h1>

            <p>
              Explore practical courses, learn from
              instructors, and build your future with
              Skillora.
            </p>

            <a
              href="#courses"
              className="btn btn-light btn-lg"
            >
              Explore Courses
            </a>
          </div>
        </div>
      </section>

      <section
        id="courses"
        className="courses-section"
      >
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-label">
                OUR COURSES
              </span>

              <h2>Find Your Next Skill</h2>
            </div>
          </div>

          <form
            onSubmit={handleSearch}
            className="search-box"
          >
            <div className="search-input">
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <div className="category-input">
              <input
                type="text"
                placeholder="Category..."
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              />
            </div>

            <button className="btn btn-navy">
              Search
            </button>
          </form>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {loading ? (
            <Loading text="Loading courses..." />
          ) : courses.length === 0 ? (
            <div className="empty-state">
              <h4>No courses found</h4>

              <p>
                Try another search or category.
              </p>
            </div>
          ) : (
            <>
              <div className="row g-4">
                {courses.map((course) => (
                  <div
                    className="col-md-6 col-lg-4"
                    key={course._id}
                  >
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>

              {pages > 1 && (
                <div className="pagination-wrapper">
                  <button
                    className="btn btn-outline-navy"
                    disabled={page === 1}
                    onClick={() =>
                      setPage(page - 1)
                    }
                  >
                    ← Previous
                  </button>

                  <span>
                    Page {page} of {pages}
                  </span>

                  <button
                    className="btn btn-outline-navy"
                    disabled={page === pages}
                    onClick={() =>
                      setPage(page + 1)
                    }
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
