import { useNavigate } from "react-router-dom";

export default function LogoutButton({ setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4 w-full"
    >
      Logout
    </button>
  );
}
