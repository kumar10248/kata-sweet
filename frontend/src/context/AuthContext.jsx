import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

// Helper function to decode JWT
const decodeToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// Helper function to check if token is expired
const isTokenExpired = (token) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage on mount
    const storedToken = localStorage.getItem("token");
    
    if (storedToken) {
      // Check if token is expired
      if (isTokenExpired(storedToken)) {
        console.log("Token expired, clearing...");
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } else {
        setToken(storedToken);
        const decoded = decodeToken(storedToken);
        setUser(decoded);
        
        // Set token in axios default headers
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
    }
    
    setLoading(false);
  }, []);

  const login = (jwtToken) => {
    localStorage.setItem("token", jwtToken);
    setToken(jwtToken);
    const decoded = decodeToken(jwtToken);
    setUser(decoded);
    
    // Set token in axios default headers
    api.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    
    // Remove token from axios default headers
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
