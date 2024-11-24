import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from ".//authprovider";

const ProtectedRoute = ({ children }) => {
    // check current logged in user
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <p>Loading...</p>;
  }
  // 로그인 안되있으면 그냥 고르인 페이지로 돌아가셈
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  // 맞으면 jwt required 보임.
  return children;
}

export default ProtectedRoute;
