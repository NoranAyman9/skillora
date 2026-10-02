import { createContext, useContext, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("skilloraToken")
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("skilloraUser");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("skilloraToken", token);
    localStorage.setItem(
      "skilloraUser",
      JSON.stringify(user)
    );

    setToken(token);
    setUser(user);

    return response.data;
  };

  const register = async (
    name,
    email,
    password,
    role,
    instructorSecret
  ) => {
    const config =
      role === "instructor"
        ? {
            headers: {
              "x-instructor-secret": instructorSecret,
            },
          }
        : {};

    const response = await api.post(
      "/auth/register",
      {
        name,
        email,
        password,
        role,
      },
      config
    );

    const { token, user } = response.data;

    localStorage.setItem("skilloraToken", token);
    localStorage.setItem(
      "skilloraUser",
      JSON.stringify(user)
    );

    setToken(token);
    setUser(user);

    return response.data;
  };

  const getProfile = async () => {
    const response = await api.get("/auth/profile");

    setUser(response.data);

    localStorage.setItem(
      "skilloraUser",
      JSON.stringify(response.data)
    );

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("skilloraToken");
    localStorage.removeItem("skilloraUser");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        register,
        logout,
        getProfile,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
