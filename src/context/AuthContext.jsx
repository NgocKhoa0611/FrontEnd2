import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in cookies
    const token = document.cookie.split(';').find(c => c.trim().startsWith('token='));
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('=')[1].split('.')[1])); // Decode token
        if (decodedToken?.role === 1) {
          setUser(decodedToken);
        } else {
          navigate('/admin/login'); // Redirect if not admin
        }
      } catch (error) {
        console.error('Invalid token:', error);
        navigate('/admin/login'); // Redirect on error
      }
    } else {
      navigate('/admin/login'); // Redirect if no token
    }
  }, [navigate]); // Re-run when `navigate` changes

  const login = (token) => {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode token
      if (decodedToken?.role === 1) {
        document.cookie = `token=${token}; path=/; max-age=${60 * 60}`; // Set token in cookies
        setUser(decodedToken);
        navigate('/admin'); // Redirect to admin page
      } else {
        navigate('/admin/login'); // Redirect if role mismatch
      }
    } catch (error) {
      console.error('Invalid login token:', error);
      navigate('/admin/login'); // Redirect on login error
    }
  };

  const logout = () => {
    document.cookie = 'token=; Max-Age=0; path=/'; // Clear token
    setUser(null);
    navigate('/admin/login'); // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
