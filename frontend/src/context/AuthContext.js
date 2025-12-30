import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    try {
      const saved = localStorage.getItem("foodieflow_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) setUser(parsed);
      }
    } catch {}
  }, []);

  const login = async (username, password) => {
    try {
      const { data } = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });
      if (!data || !data.id) return false;
      const loggedInUser = {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
      };
      setUser(loggedInUser);
      try {
        localStorage.setItem("foodieflow_user", JSON.stringify(loggedInUser));
      } catch {}
      try {
        const [userCartRes, favoritesRes] = await Promise.all([
          axios.get(`http://localhost:5000/cart/${loggedInUser.id}`),
          axios.get(`http://localhost:5000/favorites/${loggedInUser.id}`),
        ]);
        const cartRows = userCartRes.data || [];
        const cartItems = cartRows.map((r) => ({
          id: r.menu_id,
          name: r.menu_name || `Item ${r.menu_id}`,
          price: r.menu_price ?? 0,
          image: "",
          quantity: r.quantity || 1,
        }));
        window.dispatchEvent(new CustomEvent("reloadCart", { detail: cartItems }));
        const favoriteRows = favoritesRes.data || [];
        const favoriteIds = favoriteRows.map((f) => f.menu_id);
        window.dispatchEvent(new CustomEvent("reloadFavorites", { detail: favoriteIds }));
      } catch (e) {
        console.error("Post-login data load error:", e);
      }
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const signup = async (username, email, password) => {
    try {
      const { status } = await axios.post("http://localhost:5000/signup", {
        username,
        email,
        password,
      });
      return status >= 200 && status < 300;
    } catch (err) {
      console.error("Signup error:", err);
      return false;
    }
  };

  // LOGOUT
  const logout = async () => {
    const current = user;
    setUser(null);
    try {
      localStorage.removeItem("foodieflow_user");
    } catch {}
    window.dispatchEvent(new Event("clearCart"));
    window.dispatchEvent(new CustomEvent("reloadFavorites", { detail: [] }));
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
