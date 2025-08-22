import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ Use environment variable instead of hardcoding localhost
const API_URL = process.env.REACT_APP_API_URL;

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
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
    const minLength = 8;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    return password.length >= minLength && hasNumber && hasLetter;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = form;

    if ((isRegister && !username) || !email || !password) {
      alert("Please fill all required fields.");
      return;
    }

    if (isRegister && !validatePassword(password)) {
      alert("Password must be at least 8 characters long and contain letters and numbers.");
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        // ✅ Use backend URL from environment variable
        await axios.post(`${API_URL}/register/`, { username, email, password });
        alert("Account created successfully! Please login.");
        setIsRegister(false);
        setForm({ username: "", email: "", password: "" });
      } else {
        // ✅ Use backend URL from environment variable
        const res = await axios.post(`${API_URL}/login/`, { email, password });
        localStorage.setItem("token", res.data.email);
        localStorage.setItem("user", JSON.stringify(res.data));
        setUser(res.data);
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "An error occurred. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-purple-800 via-purple-600 to-purple-400">
      <form
        onSubmit={handleSubmit}
        className="bg-white/30 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-xl w-full max-w-md"
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
            className="border border-white/50 bg-white/20 text-black/80 placeholder-black/70 p-2 rounded w-full mb-3"
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
          className="border border-white/50 bg-white/20 text-black/80 placeholder-black/70 p-2 rounded w-full mb-3"
          required
          autoComplete="email"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border border-white/50 bg-white/20 text-black/80 placeholder-black/70 p-2 rounded w-full mb-3"
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
