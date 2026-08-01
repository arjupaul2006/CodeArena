// this file is used to protect the routes that require authentication. It checks if the user is logged in and if not, it redirects to the login page.
import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext.jsx";
import axios from "axios";


const UserProtect = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  useEffect(() => {
    const validateToken = async () => {
      try {
        await axios.post("http://localhost:4000/api/validate-token", {}, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Token validation error:", error);
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    };

    validateToken();
  }, [token]);

  return <>{children}</>;
};

export default UserProtect;
