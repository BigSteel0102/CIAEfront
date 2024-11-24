import React, { createContext, useState, useEffect } from "react";
import { authservice } from "./authservice";

export const AuthContext = createContext();

// for current user information
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // checks local storage to get access token
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setUser({ token });
    }
    // when done, set loading to flase cuz complete
    setLoading(false);
  }, []);

  // 로그인
  const login = async (data) => {
    try {
      const response = await authservice.login(data);
      // authservice login 에서 받아온 리턴값
      if (response.access_token) {
        setUser({ token: response.access_token });
      }
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Rethrow to handle in the component
    }
  };

  // 로그아웃
  const logout = () => {
    authservice.logout();
    setUser(null);
  };

  // token refresh
  const refresh = async () => {
    try {
      const response = await authservice.refreshToken();
      if (response.access_token) {
        setUser({ token: response.access_token });
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
  };

  // i think this allows the values accessible to children(like other components can access the data)
  return (
    <AuthContext.Provider value={{ user, login, logout, refresh, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;


// "const { user } = useContext(AuthContext);" 이걸로 can access user data