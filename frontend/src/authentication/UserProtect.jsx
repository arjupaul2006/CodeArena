// this file is used to protect the routes that require authentication. It checks if the user is logged in and if not, it redirects to the login page.
import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext.jsx";
import axios from "axios";


const UserProtect = ({ children }) => {
  const token = localStorage.getItem("token");
  const { setUser } = useContext(UserDataContext);

  useEffect(() => {
    if (!token) {
      return;
    }

    const validateToken = async () => {
      try {
        const response = await axios.post("http://localhost:4000/api/validate-token", {}, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error("Token validation error:", error);
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    };

    validateToken();
  }, [token, setUser]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default UserProtect;
