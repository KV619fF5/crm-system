import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL; // local or deployed backend

export default function Register({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Alert state
  const [alert, setAlert] = useState({ message: "", type: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const showAlert = (message, type = "info") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = form;

    if (!username || !email || !password) {
      showAlert("Please fill all fields.", "error");
      return;
    }

    if (!validatePassword(password)) {
      showAlert(
        "Password must be at least 8 characters and contain at least one number and one letter.",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/register/`, { username, email, password });

      showAlert("Account created successfully! Please login.", "success");

      setForm({ username: "", email: "", password: "" });

      setTimeout(() => navigate("/login"), 1500); // redirect after showing success
    } catch (err) {
      console.error(err);

      if (err.response) {
        if (err.response.status === 401) {
          showAlert("Unauthorized. Check credentials.", "error");
        } else {
          showAlert(err.response.data?.detail || "Server error occurred.", "error");
        }
      } else if (err.request) {
        showAlert("Cannot connect to the server. Check backend.", "error");
      } else {
        showAlert("An error occurred. Check console.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50 relative">
      {/* Alert Box */}
      {alert.message && (
        <div
          className={`absolute top-5 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg text-white font-semibold
            ${alert.type === "success" ? "bg-green-500" : ""}
            ${alert.type === "error" ? "bg-red-500" : ""}
            ${alert.type === "info" ? "bg-blue-500" : ""}
            transition-all duration-500`}
        >
          {alert.message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-4"
          required
          autoComplete="username"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-4"
          required
          autoComplete="email"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-6"
          required
          autoComplete="new-password"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition-all duration-300"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>
    </div>
  );
}
