import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

const Profile = () => {
  const {
    user,
    getProfile,
  } = useAuth();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        await getProfile();
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return <Loading text="Loading profile..." />;
  }

  return (
    <div className="container py-5">
      <div className="profile-card">
        <div className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <h1>{user?.name}</h1>

        <span className="role-badge">
          {user?.role}
        </span>

        <div className="profile-info">
          <div>
            <small>Email</small>
            <strong>{user?.email}</strong>
          </div>

          <div>
            <small>Account Type</small>
            <strong>{user?.role}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;