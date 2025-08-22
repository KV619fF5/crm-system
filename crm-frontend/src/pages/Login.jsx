import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL; // local or deployed backend

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Alert state
  const [alert, setAlert] = useState({ message: "", type: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    return password.length >= 8 && /\d/.test(password) && /[a-zA-Z]/.test(password);
  };

  const showAlert = (message, type = "info") => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = form;

    if ((isRegister && !username) || !email || !password) {
      showAlert("Please fill all required fields.", "error");
      return;
    }

    if (isRegister && !validatePassword(password)) {
      showAlert(
        "Password must be at least 8 characters long and contain letters and numbers.",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await axios.post(`${API_URL}/register/`, { username, email, password });
        showAlert("Account created successfully! Please login.", "success");
        setIsRegister(false);
        setForm({ username: "", email: "", password: "" });
      } else {
        const res = await axios.post(`${API_URL}/login/`, { email, password });
        localStorage.setItem("token", res.data.email);
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
        navigate("/");
      }
    } catch (err) {
      console.error(err);

      // Handle common Axios errors
      if (err.response) {
        // Server responded with a status
        if (err.response.status === 401) {
          showAlert("Invalid credentials. Please try again.", "error");
        } else {
          showAlert(err.response.data?.detail || "Server error occurred.", "error");
        }
      } else if (err.request) {
        // No response received
        showAlert("Cannot connect to the server. Check backend.", "error");
      } else {
        // Other errors
        showAlert("An error occurred. Check console.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-purple-800 via-purple-600 to-purple-800 relative">
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
        className="bg-white/30 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-black drop-shadow-lg">
          {isRegister ? "Register Here" : "Welcome to CRM System Login Page"}
        </h2>

        {isRegister && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="border border-white/20 bg-white/20 text-black/80 placeholder-black/70 p-2 rounded w-full mb-3"
            required
            autoComplete="off"
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border border-white/20 bg-white/20 text-black/80 placeholder-black/70 p-2 rounded w-full mb-3"
          required
          autoComplete="email"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border border-white/20 bg-white/20 text-black/80 placeholder-black/70 p-2 rounded w-full mb-3"
          autoComplete={isRegister ? "new-password" : "current-password"}
        />

        <button
          type="submit"
          className="bg-white/40 text-black px-4 py-3 rounded-lg w-full mb-3 hover:bg-black/60 hover:shadow-xl transition-all duration-300"
          disabled={loading}
        >
          {loading ? (isRegister ? "Registering..." : "Logging in...") : isRegister ? "Register" : "Login"}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setForm({ username: "", email: "", password: "" });
          }}
          className="text-black underline w-full mt-1 hover:text-black/90 transition"
        >
          {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
        </button>
      </form>
    </div>
  );
}
