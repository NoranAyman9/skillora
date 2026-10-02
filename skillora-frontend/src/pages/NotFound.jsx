import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-number">404</div>

        <h1>Page Not Found</h1>

        <p>
          Sorry, the page you are looking for does not exist.
        </p>

        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;