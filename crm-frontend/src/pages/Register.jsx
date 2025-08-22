import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    // Minimum 8 characters, at least one letter and one number
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = form;

    if (!username || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    if (!validatePassword(password)) {
      alert("Password must be at least 8 characters and contain at least one number and one letter.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/register/", { username, email, password });
      
      alert("Account created successfully! Please login.");

      // Optional: auto-login after registration
      // localStorage.setItem("token", res.data.email); // replace with actual token if backend provides
      // setUser(res.data);
      // navigate("/");

      // Redirect to login page
      navigate("/login");
      setForm({ username: "", email: "", password: "" });
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.detail || "Registration failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-blue-50">
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
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>
    </div>
  );
}
